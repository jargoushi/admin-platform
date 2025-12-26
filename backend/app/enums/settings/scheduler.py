"""调度任务配置枚举"""

from app.enums.settings.base import BaseSetting, BaseSettingEnum, SettingValueType


class SchedulerSettingEnum(BaseSettingEnum):
    """
    调度任务配置枚举

    用户可通过配置界面设置各任务的开关和执行时间
    """

    # 采集任务
    COLLECT_ENABLED = BaseSetting(
        201, "采集任务开关", False, SettingValueType.BOOL
    )
    COLLECT_CRON = BaseSetting(
        202, "采集任务Cron", "0 */2 * * *", SettingValueType.STR
    )

    # 创作任务
    CREATE_ENABLED = BaseSetting(
        203, "创作任务开关", False, SettingValueType.BOOL
    )
    CREATE_CRON = BaseSetting(
        204, "创作任务Cron", "0 8 * * *", SettingValueType.STR
    )

    # 发布任务
    PUBLISH_ENABLED = BaseSetting(
        205, "发布任务开关", False, SettingValueType.BOOL
    )
    PUBLISH_CRON = BaseSetting(
        206, "发布任务Cron", "0 10 * * *", SettingValueType.STR
    )
