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
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      external: [],
      output: {
        globals: {
          buffer: 'Buffer',
          process: 'process',
        },
        manualChunks: (id) => {
          // Split vendor chunks for better caching
          if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor';
          }
          if (id.includes('react-router-dom')) {
            return 'router';
          }
          if (id.includes('@headlessui/react') || id.includes('@heroicons/react') || id.includes('framer-motion')) {
            return 'ui';
          }
          if (id.includes('@supabase/supabase-js')) {
            return 'supabase';
          }
          if (id.includes('clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority')) {
            return 'utils';
          }
        },
      },
    },
  },
})
