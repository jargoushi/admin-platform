import * as z from 'zod';

/**
 * 监控配置校验 Schema
 */
export const monitorConfigSchema = z.object({
  channel_code: z.number().min(1, '请选择渠道类型'),
  target_url: z
    .string()
    .min(1, '请输入监控目标链接')
    .max(512, '链接长度不能超过 512 个字符')
    .url('请输入有效的 URL 链接')
});

/**
 * 从 Schema 推导出的类型定义
 */
export type MonitorConfigFormData = z.infer<typeof monitorConfigSchema>;
