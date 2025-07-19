import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8080,
    host: true,
    allowedHosts: ['www.artifactvirtual.com', 'localhost', '127.0.0.1']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor';
            if (id.includes('three')) return 'three-vendor';
            if (id.includes('radix-ui')) return 'radix-vendor';
            return 'vendor';
          }
        },
      },
    },
  },
});
