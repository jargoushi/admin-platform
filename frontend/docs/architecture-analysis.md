# 前端代码架构分析报告

## 项目概述

这是一个基于 **Next.js 15 + React 19** 构建的现代化后台管理系统前端项目，采用 **Tailwind CSS 4 + Shadcn UI** 作为样式解决方案。

---

## 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Next.js 15.2.3 + React 19 |
| 语言 | TypeScript 5 |
| 样式 | Tailwind CSS 4 + Shadcn UI |
| 状态管理 | URL Query State (nuqs) |
| 表单 | react-hook-form + zod |
| HTTP | axios (封装) |
| 表格 | @tanstack/react-table |
| 图表 | recharts |
| 主题 | next-themes |
| 包管理 | pnpm |

---

## 目录结构

```
frontend/src/
├── app/                    # Next.js App Router 路由
│   ├── (auth)/            # 认证模块 (登录/注册)
│   ├── (dashboard)/       # 仪表板模块 (受保护路由)
│   │   ├── account/       # 账号管理
│   │   ├── activation/    # 激活码管理
│   │   ├── browser/       # 浏览器管理
│   │   ├── dashboard/     # 仪表盘首页
│   │   ├── monitor/       # 监控配置
│   │   ├── task/          # 任务管理
│   │   └── user/          # 用户管理
│   ├── globals.css        # 全局样式 + 主题变量
│   └── layout.tsx         # 根布局
├── components/
│   ├── layout/            # 布局组件 (侧边栏、导航、头部)
│   ├── shared/            # 共享业务组件
│   ├── table/             # 表格相关组件
│   └── ui/                # Shadcn UI 组件 (33个)
├── config/                # 配置文件
├── constants/             # 常量定义 (路由、分页)
├── contexts/              # React Context (ThemeProvider)
├── hooks/                 # 自定义 Hooks (6个)
├── lib/                   # 工具库
│   ├── http/              # HTTP 请求封装
│   ├── date.ts            # 日期工具
│   └── utils.ts           # 通用工具
├── middleware.ts          # 路由中间件 (认证保护)
├── service/api/           # API 服务层 (9个模块)
└── types/                 # TypeScript 类型定义
```

---

## 核心架构分析

### 1. 路由与中间件

采用 Next.js App Router 的**路由组**模式：

- `(auth)` - 公开路由组（登录、注册）
- `(dashboard)` - 受保护路由组（需登录）

`middleware.ts` 实现路由保护：
- 使用 Cookie (`auth_status`) 作为登录状态标记
- 未登录访问受保护路由 → 重定向到 `/login`
- 已登录访问公开路由 → 重定向到 `/`

### 2. HTTP 请求层

封装在 `lib/http/` 目录：

| 文件 | 功能 |
|------|------|
| `request.ts` | HttpRequest 类，提供 RESTful API 方法 |
| `interceptors.ts` | 请求/响应拦截器（JWT注入、错误处理） |
| `token.ts` | TokenManager 管理 localStorage + Cookie 同步 |
| `types.ts` | API 响应类型定义 |

**特点**：
- 自动注入 Bearer Token
- 统一业务码判断 (`success === true` 或 `code === 200`)
- 401 自动跳转登录页
- ISO 日期格式自动转换

### 3. API 服务层

位于 `service/api/` 目录，共 9 个模块：

| 服务 | 功能 |
|------|------|
| `auth.api.ts` | 登录、登出、获取Profile、修改密码 |
| `user.api.ts` | 用户注册、CRUD、分页查询 |
| `activation.api.ts` | 激活码管理 |
| `account.api.ts` | 账号管理 |
| `browser.api.ts` | 浏览器管理 |
| `monitor.api.ts` | 监控配置 |
| `task.api.ts` | 任务管理 |
| `common.api.ts` | 通用接口 |
| `setting.api.ts` | 设置相关 |

### 4. 自定义 Hooks

位于 `hooks/` 目录：

| Hook | 功能 |
|------|------|
| `use-page-list.ts` | **通用分页列表管理**（最核心） |
| `use-form-submit.ts` | 表单提交逻辑封装 |
| `use-confirmation.tsx` | 确认对话框 |
| `use-generic-dialogs.tsx` | 通用对话框管理 |
| `use-breadcrumbs.ts` | 面包屑导航 |
| `use-mobile.ts` | 移动端检测 |

**`usePageList` 特点**：
- 使用 `nuqs` 将筛选条件同步到 URL
- 自动加载数据、刷新、重置
- 分页信息自动管理

### 5. 组件体系

#### UI 组件 (33个 Shadcn 组件)
位于 `components/ui/`，包括：
- 基础：Button, Input, Label, Textarea, Select, Checkbox, Switch
- 反馈：Dialog, AlertDialog, Sheet, Drawer, Tooltip, Sonner
- 导航：Tabs, Breadcrumb, Sidebar, DropdownMenu
- 数据：Table, Card, Badge, Avatar, Calendar
- 其他：Command, Popover, ScrollArea, Collapsible

#### 布局组件
位于 `components/layout/`：

| 组件 | 功能 |
|------|------|
| `app-sidebar.tsx` | 应用侧边栏容器 |
| `nav-main.tsx` | 动态导航菜单（支持多级展开） |
| `nav-user.tsx` | 用户菜单（头像、退出登录） |
| `header.tsx` | 页面头部 |
| `breadcrumbs.tsx` | 动态面包屑 |
| `settings-dialog.tsx` | 设置对话框 |
| `mode-toggle.tsx` | 主题切换 |

### 6. 样式系统

`globals.css` 定义了完整的设计系统：

**OKLCH 色彩系统**：
- 主色 (Primary)：蓝紫色调
- 强调色 (Accent)：青色
- 危险色 (Destructive)：红色
- 完整的明/暗主题变量

**现代化增强样式**：
- 玻璃态效果 (`.glass`, `.glass-card`)
- 渐变边框 (`.gradient-border`, `.border-gradient`)
- 悬浮发光效果 (`.hover-glow`, `.btn-glow`)
- 自定义动画（shimmer、pulse、slide、scale）
- 表格增强样式 (`.data-table`)
- 状态指示器 (`.status-dot-*`)

### 7. 业务页面模式

每个业务模块（如 `activation`, `user`）遵循统一结构：

```
module/
├── page.tsx           # 页面入口
├── types.ts           # 类型定义
├── constants.ts       # 常量配置
├── *.schema.ts        # Zod 表单验证
└── components/        # 模块专属组件
```

---

## 架构亮点

1. **类型安全**：完整的 TypeScript 类型定义，从 API 响应到表单验证
2. **URL 状态管理**：使用 `nuqs` 将筛选条件持久化到 URL，支持分享和刷新保持
3. **统一 HTTP 封装**：拦截器自动处理认证、错误、日期转换
4. **组件化设计**：Shadcn UI + 自定义布局组件，高度可复用
5. **主题系统**：支持明暗主题，使用 OKLCH 色彩空间
6. **现代化 UI**：玻璃态、渐变、动画等视觉增强

---

## 页面功能模块

| 模块 | 路由 | 功能 |
|------|------|------|
| 仪表盘 | `/dashboard` | 系统概览 |
| 监控配置 | `/monitor` | 数据监控设置 |
| 任务管理 | `/task` | 任务列表 |
| 浏览器管理 | `/browser` | 浏览器实例管理 |
| 激活码管理 | `/activation` | 激活码生成、查询 |
| 用户管理 | `/user` | 用户 CRUD |
| 账号管理 | `/account` | 账号信息管理 |
