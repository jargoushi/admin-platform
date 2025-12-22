import * as z from 'zod';
import { INIT_COUNT_RANGE, DISTRIBUTE_COUNT_RANGE } from './constants';

/**
 * 激活码初始化校验 Schema（简化版：单次初始化单种类型）
 */
export const activationCodeInitSchema = z.object({
  type: z.number(),
  count: z
    .number()
    .min(INIT_COUNT_RANGE.MIN, `生成数量至少为 ${INIT_COUNT_RANGE.MIN}`)
    .max(INIT_COUNT_RANGE.MAX, `生成数量最多为 ${INIT_COUNT_RANGE.MAX}`)
});

/**
 * 激活码派发校验 Schema
 */
export const activationCodeDistributeSchema = z.object({
  type: z.number(),
  count: z
    .number()
    .min(DISTRIBUTE_COUNT_RANGE.MIN, `派发数量至少为 ${DISTRIBUTE_COUNT_RANGE.MIN}`)
    .max(DISTRIBUTE_COUNT_RANGE.MAX, `派发数量最多为 ${DISTRIBUTE_COUNT_RANGE.MAX}`)
});

/**
 * 从 Schema 推导出的类型定义
 */
export type ActivationCodeInitFormData = z.infer<typeof activationCodeInitSchema>;
export type ActivationCodeDistributeFormData = z.infer<typeof activationCodeDistributeSchema>;
