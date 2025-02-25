import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react-grid-layout', 'react-resizable']
  },
  css: {
    postcss: './postcss.config.js'
  }
})
