import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // THis is for turning on https on localhost
    // basicSsl()
  ],
  define: {
    // By default, Vite doesn't include shims for NodeJS/
    // necessary for segment analytics lib to work
    global: {},
  },
  // resolve: {
  //   alias: {
  //     "readable-stream": "vite-compatible-readable-stream"
  //   },
  // },
})
