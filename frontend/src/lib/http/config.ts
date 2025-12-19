/**
 * 环境配置接口
 */
interface EnvConfig {
  /** API 基础地址 */
  baseURL: string;
  /** 请求超时时间（毫秒） */
  timeout: number;
}

/**
 * 环境类型
 */
type Environment = 'development' | 'production' | 'test';

/**
 * 获取当前环境配置
 */
function getEnvConfig(): EnvConfig {
  const env = (process.env.NODE_ENV || 'development') as Environment;

  const configs: Record<Environment, EnvConfig> = {
    development: {
      baseURL:
        process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
      timeout: 30000
    },
    production: {
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
      timeout: 15000
    },
    test: {
      baseURL:
        process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
      timeout: 20000
    }
  };

  return configs[env];
}

export const ENV_CONFIG = getEnvConfig();
