# HTTP 请求模块

基于 axios 封装的类型安全 HTTP 请求库。

## 核心特性

- ✅ **完整的 TypeScript 类型支持**（零 any 类型）
- ✅ **自动 Token 注入**（Authorization Header）
- ✅ **401 自动跳转登录**
- ✅ **统一错误处理和提示**
- ✅ **多环境配置**（开发/测试/生产）
- ✅ **RESTful 路径参数支持**
- ✅ **请求/响应拦截器**
- ✅ **与后端 Python 模型完全一致**

## 快速开始

### 1. 基础用法

```typescript
import { http, TokenManager } from '@/lib/http';

// 定义类型
interface User {
  id: number;
  username: string;
  email: string;
}

// GET 请求（单个数据）
const res = await http.get<User>('/users/{id}', undefined, {
  pathParams: { id: 1 }
});

console.log(res.success); // true
console.log(res.code); // 200
console.log(res.message); // "操作成功"
console.log(res.data); // User | undefined
console.log(res.timestamp); // "2025-01-12T10:30:00Z"
```

### 2. 分页查询

```typescript
import type { PageResponse } from '@/lib/http';

// 分页请求返回 PageResponse
const res = await http.get<PageResponse<User>>('/users', {
  page: 1,
  size: 10,
  username: 'admin'
});

// 响应结构（与后端 Python 模型一致）
console.log(res.success); // true
console.log(res.code); // 200
console.log(res.data?.items); // User[]
console.log(res.data?.total); // 100
console.log(res.data?.page); // 1
console.log(res.data?.size); // 10
console.log(res.data?.pages); // 10

// 实际请求: GET /api/users?page=1&size=10&username=admin
```

### 3. RESTful 路径参数

```typescript
// 使用 {参数名} 占位符
const res = await http.get<User>('/users/{id}', undefined, {
  pathParams: { id: 1 }
});
// 实际请求: GET /api/users/1

// 多个路径参数
const res = await http.get<Role>('/users/{userId}/roles/{roleId}', undefined, {
  pathParams: { userId: 1, roleId: 2 }
});
// 实际请求: GET /api/users/1/roles/2
```

### 4. POST 请求

```typescript
interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}

// 指定请求体类型和响应类型
const res = await http.post<User, CreateUserDto>('/users', {
  username: 'test',
  email: 'test@example.com',
  password: '123456'
});
```

### 5. PUT/PATCH 请求

```typescript
// 更新用户
await http.put<User>(
  '/users/{id}',
  { username: 'new_name' },
  { pathParams: { id: 1 } }
);

// 部分更新
await http.patch<User>(
  '/users/{id}/status',
  { status: 'disabled' },
  { pathParams: { id: 1 } }
);
```

### 6. DELETE 请求

```typescript
await http.delete('/users/{id}', {
  pathParams: { id: 1 }
});
```

## 认证流程

### 登录并保存 Token

```typescript
import { http, TokenManager } from '@/lib/http';

interface LoginResponse {
  token: string;
  user: User;
}

// 登录
const loginRes = await http.post<LoginResponse>('/auth/login', {
  email: 'admin@example.com',
  password: 'Admin@123456'
});

// 保存 Token
if (loginRes.data) {
  TokenManager.setToken(loginRes.data.token);
}
```

### 后续请求自动携带 Token

```typescript
// 无需手动添加 Authorization Header
// 拦截器会自动注入: Authorization: Bearer {token}
const users = await http.get<User[]>('/users');
```

### 登出

```typescript
// 清除 Token
TokenManager.removeToken();

// 跳转到登录页
window.location.href = '/login';
```

## 分页数据处理

```typescript
import type { ApiResponse, PageResponse } from '@/lib/http';

// 分页查询
const res = await http.get<PageResponse<User>>('/users', { page: 1, size: 10 });

// 响应结构（与后端 Python 模型完全一致）
console.log(res.success); // true（请求是否成功）
console.log(res.code); // 200（业务状态码）
console.log(res.message); // "操作成功"
console.log(res.timestamp); // "2025-01-12T10:30:00Z"

// 分页数据在 data 字段中
const pageData = res.data;
console.log(pageData?.items); // User[]（当前页数据）
console.log(pageData?.total); // 100（总记录数）
console.log(pageData?.page); // 1（当前页码）
console.log(pageData?.size); // 10（每页数量）
console.log(pageData?.pages); // 10（总页数）
```

## 错误处理

### 自动错误处理

所有错误都会自动：

1. 显示 toast 错误提示
2. 打印到控制台（开发环境）
3. 返回 Promise.reject

```typescript
try {
  const res = await http.get<User>('/users/{id}', undefined, {
    pathParams: { id: 999 }
  });

  // 成功判断（后端会返回 success: true 或 code: 200）
  if (res.success) {
    console.log('请求成功', res.data);
  }
} catch (error) {
  // 错误已经被拦截器处理，这里可以做额外处理
  console.error('请求失败', error);
}
```

### 401 自动跳转

当后端返回 401 状态码时，拦截器会自动：

1. 显示"登录已过期"提示
2. 清除 Token
3. 跳转到登录页 (`/login`)

无需手动处理！

## 环境配置

### 开发环境 (`.env.development`)

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

### 生产环境 (`.env.production`)

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-api.com/api
```

### 本地覆盖 (`.env.local`)

```bash
# 可选：本地开发时的特殊配置
NEXT_PUBLIC_API_BASE_URL=http://192.168.1.100:3000/api
```

## API 服务封装示例

推荐为每个业务模块创建独立的 API 服务类：

```typescript
// src/api/user.api.ts
import { http } from '@/lib/http';
import type { ApiResponse, PageResponse, PageRequest } from '@/lib/http';

/**
 * 用户数据类型
 */
export interface User {
  id: number;
  username: string;
  email: string;
  roleId: number;
  status: 'active' | 'disabled';
  createdAt: string;
}

/**
 * 用户筛选参数（继承分页参数）
 */
export interface UserFilters extends PageRequest {
  username?: string;
  email?: string;
  roleId?: number;
  status?: 'active' | 'disabled';
  [key: string]: string | number | undefined;
}

/**
 * 创建用户参数
 */
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  roleId: number;
}

/**
 * 用户 API 服务
 */
export class UserApiService {
  /**
   * 获取用户列表（分页）
   */
  static async getUsers(
    filters?: UserFilters
  ): Promise<ApiResponse<PageResponse<User>>> {
    return http.get<PageResponse<User>>('/users', filters);
  }

  /**
   * 获取单个用户
   */
  static async getUser(id: number): Promise<ApiResponse<User>> {
    return http.get<User>('/users/{id}', undefined, { pathParams: { id } });
  }

  /**
   * 创建用户
   */
  static async createUser(data: CreateUserDto): Promise<ApiResponse<User>> {
    return http.post<User, CreateUserDto>('/users', data);
  }

  /**
   * 更新用户
   */
  static async updateUser(
    id: number,
    data: Partial<CreateUserDto>
  ): Promise<ApiResponse<User>> {
    return http.put<User>('/users/{id}', data, { pathParams: { id } });
  }

  /**
   * 删除用户
   */
  static async deleteUser(id: number): Promise<ApiResponse<void>> {
    return http.delete('/users/{id}', { pathParams: { id } });
  }

  /**
   * 启用/禁用用户
   */
  static async toggleUserStatus(
    id: number,
    status: 'active' | 'disabled'
  ): Promise<ApiResponse<User>> {
    return http.patch<User>(
      '/users/{id}/status',
      { status },
      { pathParams: { id } }
    );
  }
}
```

### 在组件中使用

```typescript
'use client';

import { useEffect, useState } from 'react';
import { UserApiService, type User } from '@/api/user.api';

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await UserApiService.getUsers({ page: 1, size: 10 });

      // 检查成功状态
      if (res.success && res.data) {
        setUsers(res.data.items);        // 用户列表
        setTotal(res.data.total);         // 总记录数
        setPages(res.data.pages);         // 总页数
      }
    } catch (error) {
      // 错误已自动处理
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await UserApiService.deleteUser(id);
      // 刷新列表
      loadUsers();
    } catch (error) {
      // 错误已自动处理
    }
  };

  return (
    <div>
      {/* 渲染用户列表 */}
    </div>
  );
}
```

## 类型安全示例

```typescript
// ✅ 正确：完整的类型定义
interface User {
  id: number;
  username: string;
  email: string;
}

// 单个数据
const res = await http.get<User>('/users/{id}', undefined, {
  pathParams: { id: 1 }
});

// res 的类型是 ApiResponse<User>
console.log(res.success); // boolean
console.log(res.code); // number
console.log(res.message); // string
console.log(res.data); // User | undefined
console.log(res.timestamp); // string

// 分页数据
import type { PageResponse } from '@/lib/http';

const listRes = await http.get<PageResponse<User>>('/users', {
  page: 1,
  size: 10
});

// listRes.data 的类型是 PageResponse<User> | undefined
if (listRes.data) {
  console.log(listRes.data.items); // User[]
  console.log(listRes.data.total); // number
  console.log(listRes.data.page); // number
  console.log(listRes.data.size); // number
  console.log(listRes.data.pages); // number
}

// ❌ 错误：禁止使用 any 类型
const res = await http.get<any>('/users'); // 不符合项目规范
```

## 最佳实践

1. **始终定义明确的类型**

   - 为每个接口定义请求/响应类型
   - 禁止使用 `any` 类型

2. **使用 API 服务类**

   - 将 API 调用封装到独立的服务类中
   - 提高代码复用性和可维护性

3. **错误处理**

   - 信任自动错误处理
   - 仅在需要特殊处理时使用 try-catch

4. **Token 管理**

   - 登录后立即保存 Token
   - 登出时清除 Token
   - 不要手动添加 Authorization Header

5. **RESTful 路径参数**
   - 使用 `{参数名}` 占位符
   - 通过 `pathParams` 传递参数值

## 常见问题

### Q: 如何在服务端组件中使用？

A: 当前实现主要用于客户端组件。服务端组件建议使用原有的 fetch API。

### Q: 如何取消请求？

A: 当前版本暂不支持请求取消，后续版本会添加 AbortController 支持。

### Q: 如何处理文件上传？

A: 需要修改 Content-Type，示例：

```typescript
await http.post('/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

### Q: 如何自定义超时时间？

A: 使用 config 参数：

```typescript
await http.get('/slow-api', undefined, {
  timeout: 60000 // 60秒
});
```

## 模块结构

```
src/lib/http/
├── types.ts          # 类型定义
├── config.ts         # 环境配置
├── token.ts          # Token 管理
├── interceptors.ts   # 拦截器
├── request.ts        # 核心请求类
├── index.ts          # 统一导出
└── README.md         # 本文档
```

## License

MIT
