import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
  "@": path.resolve(__dirname, "./src"),
  // Local shim for OnchainKit artifactvirtual package used while real package/keys are not available
  "artifactvirtual": path.resolve(__dirname, "./src/shims/artifactvirtual.tsx"),
    },
  },
  server: {
    port: 8080,
    host: true,
    allowedHosts: ['www.artifactvirtual.com', 'localhost', '127.0.0.1'],
    proxy: {
      '/api/aggregator': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/aggregator/, '/api/aggregator')
      }
    }
  }
  ,
  build: {
    rollupOptions: {
      output: {
        // Split large vendor libraries into named chunks to avoid one huge vendor bundle.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three') || id.includes('three-stdlib')) {
              return 'vendor_three'
            }
            if (id.includes('wagmi') || id.includes('@wagmi') || id.includes('viem') || id.includes('@walletconnect') || id.includes('@web3modal') || id.includes('ethers')) {
              return 'vendor_web3'
            }
            if (id.includes('ox') || id.includes('@walletconnect/utils') || id.includes('protobufjs')) {
              return 'vendor_misc'
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor_react'
            }
            return 'vendor'
          }
        }
      }
    }
  }
})
