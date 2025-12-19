import * as z from 'zod';

/**
 * 个人信息更新校验 Schema
 */
export const profileSchema = z.object({
  username: z
    .string()
    .min(2, '用户名至少2位')
    .max(50, '用户名最多50位')
    .regex(/^[a-zA-Z0-9_]+$/, '只能包含字母、数字和下划线'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^1[3-9]\d{9}$/.test(val), {
      message: '请输入正确的手机号格式'
    }),
  email: z
    .string()
    .optional()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: '请输入正确的邮箱格式'
    })
});

/**
 * 修改密码校验 Schema
 */
export const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, '密码至少8位')
      .max(20, '密码最多20位')
      .regex(/[A-Z]/, '必须包含大写字母')
      .regex(/[a-z]/, '必须包含小写字母')
      .regex(/[0-9]/, '必须包含数字'),
    confirmPassword: z.string().min(1, '请确认密码')
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword']
  });

/**
 * 从 Schema 推导出的类型定义
 */
export type ProfileFormData = z.infer<typeof profileSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;
