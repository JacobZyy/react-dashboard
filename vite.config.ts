import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import libCss from 'vite-plugin-libcss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    libCss(),
    react(),
    UnoCSS(),
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
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'classnames', 'chroma-js'],
      output: {
        globals: {
          'react': 'React',
          'classnames': 'classNames',
          'chroma-js': 'chroma-js',
        },

      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8090,
  },
})
