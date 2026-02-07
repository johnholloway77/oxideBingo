import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Put html-to-image in its own file (lazy loaded)
          'html-to-image': ['html-to-image']
        }
      }
    },

    // Split CSS into separate files per page
    cssCodeSplit: true,

    // Use terser for better minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      }
    },

    // Target modern browsers for smaller bundles
    target: 'es2020',
  },

  server: {
    hmr: true,  // Hot module replacement for fast dev
    port: 3000,
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [],
  },
})
