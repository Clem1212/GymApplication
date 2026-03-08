import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import base44 from '@base44/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    base44({
      appId: process.env.VITE_BASE44_APP_ID,
      baseUrl: process.env.VITE_BASE44_APP_BASE_URL
    })
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
})