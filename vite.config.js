import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue()],
  assetsInclude: ['**/*.xlsx'],
  server: {
    host: '0.0.0.0', // 允许局域网访问
    port: 8080, // 设置默认端口为3000
    https: {
      key: './localhost-key.pem',    // 确保此路径与密钥文件相匹配
      cert: './localhost.pem'        // 确保此路径与证书文件相匹配
    },
  },
})
