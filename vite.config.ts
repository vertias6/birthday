import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  // 👇 只改了这里！
  base: '/birthday/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})