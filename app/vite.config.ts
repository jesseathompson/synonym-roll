import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use repo name for GitHub Pages, root path for custom domain
  base: process.env.VITE_REPO_NAME ? `/${process.env.VITE_REPO_NAME}/` : '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

})
