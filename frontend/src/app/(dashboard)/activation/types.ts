```typescript
import { BaseEntity, BaseQueryRequest } from '@/types/common';

/**
 * 激活码实体（与后端 ActivationCodeResponse 一致）
 */
export interface ActivationCode extends BaseEntity {
  /** 激活码字符串 */
  activation_code: string;
  /** 激活码类型码 (0=日卡, 1=月卡, 2=年卡, 3=永久卡) */
  type: number;
  /** 激活码类型名称 */
  type_name: string;
  /** 激活码状态码 (0=未使用, 1=已分发, 2=已激活, 3=作废) */
  status: number;
  /** 激活码状态名称 */
  status_name: string;
  /** 分发时间 */
  distributed_at?: string;
  /** 激活时间 */
  activated_at?: string;
  /** 过期时间 */
  expire_time?: string;
}

/**
 * 单个激活码创建项
 */
export interface ActivationCodeCreateItem {
  /** 激活码类型 (0-3) */
  type: number;
  /** 生成数量 (1-1000) */
  count: number;
}

/**
 * 批量创建激活码请求
 */
export interface ActivationCodeBatchCreateRequest {
  /** 激活码创建项列表（最多10项，每种类型只能出现一次） */
  items: ActivationCodeCreateItem[];
}

/**
 * 单个类型的激活码结果
 */
export interface ActivationCodeTypeResult {
  /** 类型码 */
  type: number;
  /** 类型名称 */
  type_name: string;
  /** 激活码字符串列表 */
  activation_codes: string[];
  /** 数量 */
  count: number;
}

/**
 * 批量激活码响应
 */
export interface ActivationCodeBatchResponse {
  /** 各类型激活码结果列表 */
  results: ActivationCodeTypeResult[];
  /** 总数量 */
  total_count: number;
  /** 各类型数量汇总 */
  summary: Record<string, number>;
}

/**
 * 获取/派发激活码请求
 */
export interface ActivationCodeGetRequest {
  /** 激活码类型 (0-3) */
  type: number;
  /** 查询/派发数量，默认1条 (1-100) */
  count?: number;
}

/**
 * 作废激活码请求
 */
export interface ActivationCodeInvalidateRequest {
  /** 激活码字符串 */
  activation_code: string;
}

/**
 * 激活码列表查询参数
 */
export interface ActivationCodeQueryRequest extends BaseQueryRequest {
  /** 激活码类型 (0-3) */
  type?: number;
  /** 激活码（精准匹配） */
  activation_code?: string;
  /** 激活码状态 (0-3) */
  status?: number;
  /** 分发时间开始（包含） */
  distributed_at_start?: string;
  /** 分发时间结束（包含） */
  distributed_at_end?: string;
  /** 激活时间开始（包含） */
  activated_at_start?: string;
  /** 激活时间结束（包含） */
  activated_at_end?: string;
  /** 过期时间开始（包含） */
  expire_time_start?: string;
  /** 过期时间结束（包含） */
  expire_time_end?: string;
  /** QueryParams 兼容索引签名 */
  [key: string]: string | number | undefined;
}
```
