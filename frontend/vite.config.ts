import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // tot ce incepe cu /api merge la backend-ul Spring Boot
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})