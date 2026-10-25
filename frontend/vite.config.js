import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    proxy: Object.fromEntries(
      ['/history', '/predict', '/model', '/metrics', '/health', '/docs', '/openapi.json'].map((path) => [
        path,
        { target: process.env.API_URL || 'http://127.0.0.1:8000', changeOrigin: true },
      ])
    ),
  },
})
