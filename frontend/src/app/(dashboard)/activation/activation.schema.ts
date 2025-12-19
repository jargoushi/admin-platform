import * as z from 'zod';
import { INIT_COUNT_RANGE, DISTRIBUTE_COUNT_RANGE } from './constants';

/**
 * 激活码单项初始化校验 Schema
 */
export const activationCodeInitItemSchema = z.object({
  type: z.number(),
  count: z
    .number()
    .min(INIT_COUNT_RANGE.MIN, `生成数量至少为 ${INIT_COUNT_RANGE.MIN}`)
    .max(INIT_COUNT_RANGE.MAX, `生成数量最多为 ${INIT_COUNT_RANGE.MAX}`)
});

/**
 * 激活码批量初始化校验 Schema
 */
export const activationCodeInitSchema = z.object({
  items: z
    .array(activationCodeInitItemSchema)
    .min(1, '至少需要添加一个初始化项')
    .refine(
      (items) => {
        const types = items.map((item) => item.type);
        return new Set(types).size === types.length;
      },
      {
        message: '激活码类型不能重复',
        path: ['items']
      }
    )
});

/**
 * 激活码派发校验 Schema
 */
export const activationCodeDistributeSchema = z.object({
  type: z.number(),
  count: z
    .number()
    .min(
      DISTRIBUTE_COUNT_RANGE.MIN,
      `派发数量至少为 ${DISTRIBUTE_COUNT_RANGE.MIN}`
    )
    .max(
      DISTRIBUTE_COUNT_RANGE.MAX,
      `派发数量最多为 ${DISTRIBUTE_COUNT_RANGE.MAX}`
    )
});

/**
 * 从 Schema 推导出的类型定义
 */
export type ActivationCodeInitFormData = z.infer<
  typeof activationCodeInitSchema
>;
export type ActivationCodeDistributeFormData = z.infer<
  typeof activationCodeDistributeSchema
>;
