import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 基础配置
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react']
  }
};

export default nextConfig;
