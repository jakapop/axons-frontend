import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { createProxy } from './build/proxy'

const VITE_PORT = 3000
const VITE_PROXY = [
  //dev
  // ['/api-sso', 'https://sso.farmthailand.app'],
  // ['/api-core', 'https://staging.farmthailand.app/api/core'],
  // ['/api-main', 'http://stg-api.checkwolrd.com/api']
  //pro
  ['/api-sso', 'https://auth-api.farmthailand.app'],
  ['/api-core', 'https://core-api.farmthailand.app/api/core'],
  ['/api-main', 'http://api.farmworld.farm/api']
]

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    server: {
      https: false,
      port: VITE_PORT,
      proxy: mode === 'development' ? createProxy(VITE_PROXY) : null
    },
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    build: {
      chunkSizeWarningLimit: 1600
    },
  }
})
