import * as z from 'zod';

/**
 * 登录表单校验 Schema
 */
export const loginSchema = z.object({
  username: z.string().min(1, '请输入用户名'),
  password: z.string().min(1, '请输入密码')
});

/**
 * 注册表单校验 Schema
 */
export const registerSchema = z
  .object({
    username: z
      .string()
      .min(2, '用户名至少2位')
      .max(50, '用户名最多50位')
      .regex(/^[a-zA-Z0-9_]+$/, '只能包含字母、数字和下划线'),
    password: z
      .string()
      .min(8, '密码至少8位')
      .max(20, '密码最多20位')
      .regex(/[A-Z]/, '必须包含大写字母')
      .regex(/[a-z]/, '必须包含小写字母')
      .regex(/[0-9]/, '必须包含数字'),
    confirmPassword: z.string().min(1, '请确认密码'),
    activation_code: z.string().min(1, '请输入激活码')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword']
  });

/**
 * 从 Schema 推导出的类型定义
 */
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
