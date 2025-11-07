import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',  // Делает сервер доступным по всем интерфейсам
    port: 5173,        // Опционально: укажите порт
    allowedHosts: ['resources.void-rp.ru', 'void-rp.ru'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})