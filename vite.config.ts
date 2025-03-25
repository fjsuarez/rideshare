import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  server: {
    headers: {
      'Service-Worker-Allowed': '/',
      '.js': 'application/javascript',
    },
    proxy: {
      '/api': { 
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  },
  publicDir: 'public',
});