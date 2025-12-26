"""调度器服务

负责管理定时任务的初始化、启动和关闭
"""

from datetime import datetime
from typing import Dict, Callable, Any, Optional

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from app.core.logging import log
from app.enums.settings.scheduler import SchedulerSettingEnum
from app.models.account.setting import Setting


class SchedulerService:
    """调度器服务"""

    def __init__(self):
        self.scheduler: Optional[AsyncIOScheduler] = None
        # 任务类型 -> 执行函数映射
        self._task_executors: Dict[int, Callable] = {}

    def register_executor(self, setting_code: int, executor: Callable):
        """
        注册任务执行器

        Args:
            setting_code: 配置项code（如 COLLECT_CRON 的 code）
            executor: 执行函数
        """
        self._task_executors[setting_code] = executor
        log.info(f"注册任务执行器: code={setting_code}")

    async def start(self):
        """启动调度器"""
        self.scheduler = AsyncIOScheduler()
        self.scheduler.start()
        log.info("✅ 调度器已启动")

        # 注册默认任务执行器
        self._register_default_executors()

        # 注册系统级固定定时任务（与用户无关）
        self._register_system_tasks()

        # 加载配置并添加用户任务
        await self._load_tasks()

    async def stop(self):
        """停止调度器"""
        if self.scheduler:
            self.scheduler.shutdown(wait=False)
            log.info("✅ 调度器已停止")

    def _register_default_executors(self):
        """注册默认任务执行器"""
        self.register_executor(
            SchedulerSettingEnum.COLLECT_CRON.code,
            self._collect_task
        )
        self.register_executor(
            SchedulerSettingEnum.CREATE_CRON.code,
            self._create_task
        )
        self.register_executor(
            SchedulerSettingEnum.PUBLISH_CRON.code,
            self._publish_task
        )

    def _register_system_tasks(self):
        """
        注册系统级固定定时任务（与用户无关）

        这些任务使用固定的 cron 表达式，不依赖用户配置
        """
        # 数据统计任务 - 每小时执行
        trigger = CronTrigger(minute=0)  # 每小时整点执行
        self.scheduler.add_job(
            self._stats_task,
            trigger,
            id="system_stats",
            replace_existing=True,
        )
        log.info("添加系统任务: 数据统计, cron=每小时整点")

    async def _load_tasks(self):
        """从数据库加载任务配置"""
        # 获取所有用户的调度配置
        settings = await Setting.filter(
            setting_key__in=[
                SchedulerSettingEnum.COLLECT_ENABLED.code,
                SchedulerSettingEnum.COLLECT_CRON.code,
                SchedulerSettingEnum.CREATE_ENABLED.code,
                SchedulerSettingEnum.CREATE_CRON.code,
                SchedulerSettingEnum.PUBLISH_ENABLED.code,
                SchedulerSettingEnum.PUBLISH_CRON.code,
            ]
        ).all()

        # 按 owner_id 分组
        user_settings: Dict[int, Dict[int, Any]] = {}
        for setting in settings:
            if setting.owner_id not in user_settings:
                user_settings[setting.owner_id] = {}
            user_settings[setting.owner_id][setting.setting_key] = setting.setting_value

        # 为每个用户添加任务
        for owner_id, config in user_settings.items():
            self._add_user_tasks(owner_id, config)

    def _add_user_tasks(self, owner_id: int, config: Dict[int, Any]):
        """为用户添加定时任务"""
        task_configs = [
            (
                SchedulerSettingEnum.COLLECT_ENABLED.code,
                SchedulerSettingEnum.COLLECT_CRON.code,
                "采集"
            ),
            (
                SchedulerSettingEnum.CREATE_ENABLED.code,
                SchedulerSettingEnum.CREATE_CRON.code,
                "创作"
            ),
            (
                SchedulerSettingEnum.PUBLISH_ENABLED.code,
                SchedulerSettingEnum.PUBLISH_CRON.code,
                "发布"
            ),
        ]

        for enabled_code, cron_code, task_name in task_configs:
            enabled = config.get(enabled_code, False)
            cron_expr = config.get(cron_code)

            if enabled and cron_expr:
                executor = self._task_executors.get(cron_code)
                if executor:
                    job_id = f"{task_name}_{owner_id}"
                    try:
                        trigger = CronTrigger.from_crontab(cron_expr)
                        self.scheduler.add_job(
                            executor,
                            trigger,
                            id=job_id,
                            args=[owner_id],
                            replace_existing=True,
                        )
                        log.info(f"添加定时任务: {job_id}, cron={cron_expr}")
                    except Exception as e:
                        log.error(f"添加任务失败 {job_id}: {e}")

    # ========== 动态更新接口（供外部调用） ==========

    async def update_user_tasks(self, owner_id: int):
        """
        更新用户的定时任务（用户修改配置后调用）

        Args:
            owner_id: 用户ID

        使用场景：用户在前端修改了调度配置后，调用此方法刷新调度器
        """
        # 先移除该用户的所有任务
        self._remove_user_all_tasks(owner_id)

        # 重新加载该用户的配置
        settings = await Setting.filter(
            owner_id=owner_id,
            setting_key__in=[
                SchedulerSettingEnum.COLLECT_ENABLED.code,
                SchedulerSettingEnum.COLLECT_CRON.code,
                SchedulerSettingEnum.CREATE_ENABLED.code,
                SchedulerSettingEnum.CREATE_CRON.code,
                SchedulerSettingEnum.PUBLISH_ENABLED.code,
                SchedulerSettingEnum.PUBLISH_CRON.code,
            ]
        ).all()

        # 构建配置字典
        config: Dict[int, Any] = {}
        for setting in settings:
            config[setting.setting_key] = setting.setting_value

        # 重新添加任务
        self._add_user_tasks(owner_id, config)
        log.info(f"已更新用户 {owner_id} 的定时任务")

    def _remove_user_all_tasks(self, owner_id: int):
        """移除用户的所有定时任务"""
        task_names = ["采集", "创作", "发布"]
        for task_name in task_names:
            job_id = f"{task_name}_{owner_id}"
            try:
                self.scheduler.remove_job(job_id)
                log.info(f"移除定时任务: {job_id}")
            except Exception:
                # 任务不存在时忽略
                pass

    def remove_user_task(self, owner_id: int, task_name: str):
        """
        移除用户的指定任务

        Args:
            owner_id: 用户ID
            task_name: 任务名称（"采集"/"创作"/"发布"）
        """
        job_id = f"{task_name}_{owner_id}"
        try:
            self.scheduler.remove_job(job_id)
            log.info(f"移除定时任务: {job_id}")
        except Exception:
            pass

    # ========== 任务执行器 ==========

    async def _collect_task(self, owner_id: int):
        """采集任务执行器"""
        log.info(f"[采集任务] 开始执行, owner_id={owner_id}, time={datetime.now()}")
        # TODO: 实现采集逻辑
        log.info(f"[采集任务] 执行完成, owner_id={owner_id}")

    async def _create_task(self, owner_id: int):
        """创作任务执行器"""
        log.info(f"[创作任务] 开始执行, owner_id={owner_id}, time={datetime.now()}")
        # TODO: 实现创作逻辑
        log.info(f"[创作任务] 执行完成, owner_id={owner_id}")

    async def _publish_task(self, owner_id: int):
        """发布任务执行器"""
        log.info(f"[发布任务] 开始执行, owner_id={owner_id}, time={datetime.now()}")
        # TODO: 实现发布逻辑
        log.info(f"[发布任务] 执行完成, owner_id={owner_id}")

    # ========== 系统级任务执行器 ==========

    async def _stats_task(self):
        """
        数据统计任务执行器（系统级，与用户无关）

        每小时执行一次，用于统计系统数据
        """
        log.info(f"[数据统计] 开始执行, time={datetime.now()}")
        # TODO: 实现数据统计逻辑
        # 例如：
        # - 统计用户活跃数
        # - 统计任务执行情况
        # - 生成报表数据
        log.info(f"[数据统计] 执行完成")


# 全局调度器实例
scheduler_service = SchedulerService()
