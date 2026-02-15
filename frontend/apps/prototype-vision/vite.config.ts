import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    hmr: false,  // DISABLED: Causing infinite reloads from file watcher
    // Auto-reload on CSS/JS changes
    middlewareMode: false,
    // Hot Module Replacement enabled for instant updates
    watch: {
      usePolling: false
    }
  },
  preview: {
    host: '0.0.0.0'
  }
})
