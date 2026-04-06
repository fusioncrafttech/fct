import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['buffer', 'process'],
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        globals: {
          buffer: 'Buffer',
          process: 'process',
        },
      },
    },
  },
})
