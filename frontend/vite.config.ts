
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiProxy = {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
  },
  
} as const

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { ...apiProxy },
  },
  // `npm run preview` uses this; without it, /api hits the static server and login fails (403/404).
  preview: {
    port: 4173,
    proxy: { ...apiProxy },
  },
})
