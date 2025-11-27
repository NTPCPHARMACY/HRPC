import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 載入環境變數 (Vercel 會自動提供)
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // 這是關鍵：將後端的 API_KEY 注入到前端程式碼中，
      // 讓 services/geminiService.ts 裡的 process.env.API_KEY 可以運作
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})