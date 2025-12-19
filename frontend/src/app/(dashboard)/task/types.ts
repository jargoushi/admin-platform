/**
 * 任务管理模块类型定义
 *
 * @description
 * 定义任务管理模块所需的所有 TypeScript 接口和类型
 * 包括后端 API 约定的类型和前端特有的类型
 */

/**
 * 任务实体（与后端 MonitorTaskResponse 一致）
 */
export interface MonitorTask {
  /** 任务ID */
  id: number;
  /** 渠道编码 (1-5) */
  channel_code: number;
  /** 渠道名称 */
  channel_name: string;
  /** 任务类型 (1=每日数据采集, 2=手动刷新) */
  task_type: number;
  /** 任务类型名称 */
  task_type_name: string;
  /** 业务ID */
  biz_id: number;
  /** 任务状态 (0=待执行, 1=进行中, 2=成功, 3=失败) */
  task_status: number;
  /** 任务状态名称 */
  task_status_name: string;
  /** 调度日期 */
  schedule_date: string;
  /** 错误信息 */
  error_msg?: string;
  /** 耗时(ms) */
  duration_ms: number;
  /** 创建时间 */
  created_at: string;
  /** 开始时间 */
  started_at?: string;
  /** 结束时间 */
  finished_at?: string;
}

/**
 * 任务查询参数
 */
export interface MonitorTaskQueryRequest {
  /** 当前页码 */
  page?: number;
  /** 每页数量 */
  size?: number;
  /** 渠道编码 (1-5) */
  channel_code?: number;
  /** 任务类型 (1=每日数据采集, 2=手动刷新) */
  task_type?: number;
  /** 任务状态 (0=待执行, 1=进行中, 2=成功, 3=失败) */
  task_status?: number;
  /** 开始日期 */
  start_date?: string;
  /** 结束日期 */
  end_date?: string;
  /** QueryParams 兼容索引签名 */
  [key: string]: string | number | undefined;
}
