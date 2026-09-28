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
    proxy: {
      '/predict': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/model': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/metrics': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      }
    }
  }
})
