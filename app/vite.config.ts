import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 通过环境变量 VITE_BASE 控制部署的子路径前缀，默认使用相对路径，
// 兼容 user.github.io/<repo>/ 与自定义域名两种部署形态。
// 例如：VITE_BASE=/biology-3d/ npm run build
export default defineConfig({
  base: process.env.VITE_BASE || './',
  plugins: [react()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1500,
  },
})
