# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Next.js 15 + React 19 + TypeScript 构建的现代化后台管理系统，使用 Shadcn UI 组件库和 Tailwind CSS 进行界面开发，集成了完整的 RBAC 权限管理系统。

## 常用命令

### 开发和构建

```bash
pnpm dev          # 启动开发服务器（使用 Turbopack）
pnpm build        # 构建生产版本
pnpm start        # 启动生产服务器
pnpm lint         # 代码检查和格式化
pnpm format       # 使用 Prettier 格式化代码
```

### 版本发布

```bash
pnpm commit       # 使用 Commitizen 提交代码
pnpm release      # 自动版本发布
pnpm changelog    # 生成变更日志
```

### Git 工作流

项目配置了 Husky + lint-staged 实现提交前自动化:

```bash
# 提交时自动触发
git add .
git commit -m "your message"
# → 自动执行 Prettier 格式化 (*.ts, *.tsx, *.jsx, *.json, *.md)
# → 自动执行 commitlint 验证提交信息格式

# 推荐使用 Commitizen 生成规范的提交信息
pnpm commit
```

**commitlint 规范**: 遵循 Conventional Commits，提交信息格式为 `<type>(<scope>): <subject>`

- type: feat, fix, docs, style, refactor, test, chore 等
- scope: 可选，影响范围
- subject: 简短描述

## 架构设计

### 技术栈核心

- **前端框架**: Next.js 15 (App Router) + React 19
- **UI 组件**: Shadcn UI + Tailwind CSS 4
- **认证系统**: JWT + 自定义中间件
- **状态管理**: React Hooks + Context (Zustand)
- **表单处理**: 基于 React Hook Pattern 的自定义表单
- **图标**: Lucide React + Radix Icons

### 目录结构核心

```
src/
├── app/              # Next.js App Router 页面和 API
│   ├── api/         # API 路由（按功能模块分组）
│   │   ├── auth/    # 认证相关 API
│   │   ├── users/   # 用户管理 API
│   │   ├── roles/   # 角色管理 API
│   │   └── permissions/ # 权限管理 API
│   ├── dashboard/   # 管理后台主页面
│   └── login/       # 登录页面
├── components/      # React 组件
│   ├── ui/         # Shadcn UI 基础组件
│   └── layout/     # 布局相关组件
├── lib/            # 工具函数和核心逻辑
│   ├── auth.ts     # 认证相关函数 (auth, verifyToken, getCurrentUser)
│   ├── server-permissions.ts  # 服务端权限检查 (getUserPermissions, hasPermission)
│   ├── utils.ts    # 通用工具函数
│   └── logger.ts   # 日志记录工具
├── hooks/          # 自定义 React Hooks
└── contexts/       # React Context 提供者

路径别名:
- @/*  -> src/*    # 项目源码目录
- ~/*  -> public/* # 静态资源目录
```

### 功能模块标准组织方式

以激活码管理模块 (`src/app/dashboard/activation`) 为例，展示标准的功能模块结构:

```
activation/
├── components/          # 模块专属组件
│   ├── ActivationCodeTable.tsx      # 数据表格组件
│   ├── ActivationCodeFilters.tsx    # 筛选器组件
│   ├── ActivationCodeDialogs.tsx    # 对话框组件
│   ├── ActivationCodeInitForm.tsx   # 初始化表单
│   ├── ActivationCodeDistributeForm.tsx # 分发表单
│   └── index.ts         # 组件导出索引
├── hooks/              # 模块专属 Hooks
│   ├── useActivationCodeManagement.ts # 业务逻辑 Hook
│   ├── useActivationCodeFilters.ts    # 筛选逻辑 Hook
│   └── index.ts        # Hooks 导出索引
├── types.ts            # TypeScript 类型定义
├── constants.ts        # 常量定义（如枚举、配置项）
└── page.tsx           # 页面入口组件
```

**组织原则**:

- **types.ts**: 定义所有 TypeScript 接口和类型，确保类型安全
- **constants.ts**: 集中管理枚举值、选项列表、配置常量
- **hooks/**: 封装可复用的业务逻辑，保持组件简洁
- **components/**: 按职责拆分组件，每个组件单一职责
- **index.ts**: 统一导出，简化导入路径

### 权限系统架构

- **RBAC 模型**: 用户(User) → 角色(Role) → 权限(Permission)
- **权限结构**: 树形权限结构，支持父子权限关系
- **权限代码**: 使用点分层级格式（如 `account.user.read`）
- **超级管理员**: 拥有所有权限，通过 `isSuperAdmin` 字段标识

### 认证和授权流程

1. **JWT Token**: 使用 JWT 进行无状态认证
2. **服务端认证**:
   - `auth()` - 服务端组件中获取当前会话
   - `getCurrentUser(request)` - API 路由中从请求获取用户信息
3. **权限检查**: 使用 `lib/server-permissions.ts` 中的函数
   - `getUserPermissions(userId?)` - 获取用户所有权限代码
   - `hasPermission(code, userId?)` - 检查单个权限
   - `hasAnyPermission(codes, userId?)` - 检查是否有任意权限
   - `hasAllPermissions(codes, userId?)` - 检查是否有所有权限
4. **会话管理**: 基于 Cookie 的 Token 存储

## 开发规范

### 代码质量要求

- **TypeScript 严格模式**: 必须定义明确的类型，禁止使用 `any` 类型
- **组件设计**: 优先使用函数式组件和 React Hooks
- **样式规范**: 使用 Tailwind CSS 类名，遵循 Shadcn UI 设计规范
- **错误处理**: 在 API 路由中统一错误处理和响应格式

### API 设计规范

- **RESTful 设计**: 遵循 REST API 设计原则
- **统一响应**: 使用标准的 JSON 响应格式
- **错误处理**: 提供清晰的错误信息和建议的 HTTP 状态码

## 初始化设置

### 环境配置

首次使用需要配置 `.env.local` 文件：

```bash
# JWT 密钥
JWT_SECRET="your_jwt_secret"
```

### 系统初始化

```bash
# 1. 安装依赖
pnpm install

# 2. 启动开发服务器
pnpm dev
```

## 关键开发模式

### API 路由开发

在 API 路由中实现权限保护:

```typescript
import { getCurrentUser } from '@/lib/auth';
import { hasPermission } from '@/lib/server-permissions';

export async function GET(request: Request) {
  // 1. 验证用户身份
  const user = getCurrentUser(request);
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 2. 检查权限
  const canRead = await hasPermission('account.user.read', user.id);
  if (!canRead) {
    return new Response('Forbidden', { status: 403 });
  }

  // 3. 执行业务逻辑
  // ...
}
```

### 服务端组件开发

在服务端组件中获取用户信息:

```typescript
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  // 使用 session.user
}
```

### 自定义 Hook 开发

项目使用 Hook 封装业务逻辑，典型模式如下:

```typescript
// hooks/useFeatureManagement.ts
export function useFeatureManagement() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);

  // 数据获取
  const fetchData = async (filters: FilterType) => {
    setLoading(true);
    try {
      const response = await fetch('/api/feature', {
        method: 'POST',
        body: JSON.stringify(filters)
      });
      const result = await response.json();
      setData(result.data);
    } finally {
      setLoading(false);
    }
  };

  // 操作方法
  const createItem = async (data: FormData) => {
    // 实现创建逻辑
  };

  return {
    data,
    loading,
    fetchData,
    createItem
  };
}
```

**Hook 设计原则**:

- 封装完整的业务逻辑（数据获取、状态管理、操作方法）
- 返回数据和操作方法的对象，便于解构使用
- 处理加载状态和错误处理
- 使用 TypeScript 定义清晰的参数和返回值类型

## 重要提醒

- 所有代码注释和文档必须使用中文
- 严格遵循项目既定的代码规范和架构模式
- **TypeScript 严格模式**: 禁止使用 `any` 类型，必须定义明确的类型
- 权限相关的代码修改需要特别谨慎，确保安全性
- API 路由必须进行用户身份验证和权限检查
- 提交代码前必须通过 `pnpm lint` 检查
