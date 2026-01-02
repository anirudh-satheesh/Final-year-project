import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    strictPort: true,
    allowedHosts: [
      '.ngrok-free.dev'
    ],
    proxy: {
      '/generate-roadmap': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
