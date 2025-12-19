<div align="center">
  <img src="public/logo.png" alt="N-Admin Logo" width="120" height="120">

# N Admin

基于 Next.js 15 构建的现代化后台管理系统。

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

</div>

## 特性

- **现代框架**: Next.js 15 + React 19 + TypeScript
- **UI组件**: Tailwind CSS + Shadcn UI
- **权限系统**: 基于 RBAC 的完整权限控制
- **认证**: JWT + 中间件保护
- **主题**: 明暗主题切换
- **响应式**: 完美适配桌面和移动端

## 功能模块

- 👥 用户管理 - 用户CRUD、角色分配
- 🛡️ 角色权限 - 细粒度权限控制
- 📊 数据看板 - 图表可视化
- 📝 系统日志 - 操作记录追踪
- ⚙️ 系统设置 - 个性化配置

## 快速开始

### 环境要求

- Node.js >= 18.0
- pnpm >= 9.0

### 安装

```bash
# 克隆项目
git clone https://github.com/guizimo/n-admin.git
cd n-admin

# 安装依赖
pnpm install

# 环境配置
cp .env.example .env.local

# 启动开发服务器
pnpm dev
```

访问 http://localhost:3000

## 项目结构

```
src/
├── app/              # Next.js App Router
│   ├── api/         # API 路由
│   ├── dashboard/   # 管理后台页面
│   └── login/       # 登录页面
├── components/      # 组件库
│   ├── ui/         # 基础UI组件
│   └── layout/     # 布局组件
├── lib/            # 工具函数
└── hooks/          # 自定义Hooks
```

## 开发命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm start        # 启动生产服务器
pnpm lint         # 代码检查
```

## 技术栈

### 前端

- **框架**: Next.js 15 (App Router)
- **UI**: React 19 + TypeScript
- **样式**: Tailwind CSS + Shadcn UI
- **状态**: React Hooks + Context
- **图表**: Recharts

### 后端

- **API**: Next.js API Routes
- **认证**: JWT + 中间件

### 开发工具

- **包管理**: pnpm
- **代码规范**: ESLint + Prettier
- **提交规范**: Commitizen
- **类型检查**: TypeScript

## 部署

### Vercel (推荐)

```bash
# 连接 GitHub 仓库到 Vercel
# 配置环境变量
# 自动部署
```

### Docker

```bash
docker build -t n-admin .
docker run -p 3000:3000 n-admin
```

### 传统服务器

```bash
pnpm build
pnpm start
```

## 环境变量

```bash
# JWT
JWT_SECRET="your-secret-key"
```

## 贡献

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`pnpm commit`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情

## 支持

- 📖 [文档](./DEPLOYMENT.md)
- 🐛 [问题反馈](https://github.com/guizimo/n-admin/issues)
- 💬 [讨论](https://github.com/guizimo/n-admin/discussions)
