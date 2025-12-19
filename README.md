# Admin Platform - 现代化全栈管理系统

基于 Python (FastAPI) 和 React (Next.js) 构建的现代化全栈管理系统。包含完整的权限管理、激活码系统以及地理视频生成功能。

## 🚀 项目架构

项目采用前后端分离架构：

*   **后端 (`/backend`)**:
    *   **框架**: FastAPI (高性能异步 Python 框架)
    *   **数据库**: MySQL + TortoiseORM (异步 ORM)
    *   **认证**: JWT (JSON Web Token)
    *   **包管理**: [uv](https://github.com/astral-sh/uv) (超快速的 Python 包管理器)
    *   **特色功能**: 激活码生命周期管理、地理信息视频自动生成

*   **前端 (`/frontend`)**:
    *   **框架**: Next.js 15 + React 19
    *   **样式**: Tailwind CSS 4 + Shadcn UI
    *   **状态管理**: Zustand
    *   **包管理**: pnpm
    *   **特色功能**: 响应式仪表盘、RBAC (基于角色的权限控制)、动态表单

## 🛠️ 快速开始

### 1. 环境准备

确保您的系统中已安装：
*   Python 3.10+ & [uv](https://github.com/astral-sh/uv)
*   Node.js 18+ & [pnpm](https://pnpm.io/)
*   MySQL 8.0+ (或 Docker)

### 2. 数据库配置

1.  在 Docker Desktop 中启动一个 MySQL 实例。
2.  确保端口 `3306` 可用。
3.  后端 `.env` 默认配置为：`root:123456@localhost:3306/api_web`。

### 3. 一键启动 (Windows)

在项目根目录下，使用 PowerShell 运行：
```powershell
.\dev.ps1
```
该脚本会自动为您启动后端 (Port 8000) 和 前端 (Port 3000) 服务。

## 📂 脚本说明

为了方便管理，根目录下及 `scripts/` 文件夹中提供了以下辅助脚本：

*   `.\dev.ps1`: 在新窗口中同时启动前后端。
*   `.\scripts\start.ps1`: 启动服务。
*   `.\scripts\stop.ps1`: 终止正在运行的后端 (8000) 和 前端 (3000) 进程。

## 📝 许可证

[MIT License](LICENSE)
