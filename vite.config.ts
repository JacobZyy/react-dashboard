import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    UnoCSS(),
    react(),
  ],
  resolve: {
    alias: {
      '@/': '/src/',
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, './src'),
      name: 'ReactDashBoard',
      fileName: 'react-dashboard',
    },
    rollupOptions: {
      external: ['react', 'classnames'],
      output: {
        globals: {
          react: 'React',
          classnames: 'classNames',
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8090,
  },
})
