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
          // Core React libraries
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          // Router and navigation
          if (id.includes('react-router-dom')) {
            return 'router';
          }
          // UI libraries and animations
          if (id.includes('@headlessui/react') || id.includes('@heroicons/react') || id.includes('framer-motion') || id.includes('lucide-react')) {
            return 'ui-vendor';
          }
          // Supabase and auth
          if (id.includes('@supabase/supabase-js')) {
            return 'supabase';
          }
          // Utility libraries
          if (id.includes('clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority')) {
            return 'utils';
          }
          // Form and interaction libraries
          if (id.includes('@dnd-kit/core') || id.includes('@dnd-kit/sortable') || id.includes('@dnd-kit/utilities')) {
            return 'forms';
          }
          // PDF generation
          if (id.includes('@react-pdf/renderer')) {
            return 'pdf';
          }
          // Email and communication
          if (id.includes('@emailjs/browser')) {
            return 'communication';
          }
        },
      },
    },
  },
})
