import * as z from 'zod';

/**
 * 账号基本信息校验 Schema
 */
export const accountSchema = z.object({
  name: z.string().min(1, '请输入账号名称').max(100, '账号名称最多100个字符'),
  platform_account: z
    .string()
    .max(100, '平台账号最多100个字符')
    .optional()
    .or(z.literal('')),
  platform_password: z
    .string()
    .max(100, '平台密码最多100个字符')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(500, '描述最多500个字符')
    .optional()
    .or(z.literal(''))
});

/**
 * 账号绑定校验 Schema
 */
export const bindingSchema = z.object({
  project_code: z.number(),
  channel_codes: z.array(z.number()).min(1, '请至少选择一个渠道'),
  browser_id: z
    .string()
    .max(255, '浏览器 ID 最多255个字符')
    .optional()
    .or(z.literal(''))
});

/**
 * 绑定更新校验 Schema
 */
export const bindingUpdateSchema = z.object({
  id: z.number(),
  channel_codes: z.array(z.number()).min(1, '请至少选择一个渠道'),
  browser_id: z
    .string()
    .max(255, '浏览器 ID 最多255个字符')
    .optional()
    .or(z.literal(''))
});

/**
 * 从 Schema 推导出的类型定义
 */
export type AccountFormData = z.infer<typeof accountSchema>;
export type BindingFormData = z.infer<typeof bindingSchema>;
export type BindingUpdateFormData = z.infer<typeof bindingUpdateSchema>;
