/**
 * 通用类型定义
 *
 * @description
 * 存放项目中多个模块共享的通用类型定义
 */

// ==================== 基础实体相关 ====================

/**
 * 基础实体接口
 */
export interface BaseEntity {
  id: string | number;
  created_at?: string;
  updated_at?: string;
}
import { PageRequest } from '@/lib/http/types';

/**
 * 基础查询请求接口
 */
export interface BaseQueryRequest extends PageRequest {
  [key: string]: unknown;
}
