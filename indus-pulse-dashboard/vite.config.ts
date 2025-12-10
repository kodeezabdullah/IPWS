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
  optimizeDeps: {
    include: ['deck.gl', 'mapbox-gl', 'echarts', 'echarts-for-react'],
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'deck-gl': ['deck.gl', '@deck.gl/react', '@deck.gl/layers', '@deck.gl/geo-layers'],
          'mapbox': ['mapbox-gl'],
          'echarts': ['echarts', 'echarts-for-react'],
        },
      },
    },
  },
})
