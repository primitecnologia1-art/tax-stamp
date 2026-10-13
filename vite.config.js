import { defineConfig } from 'vite';
import { productionAssets } from './scripts/production-assets.mjs';

// Quick Tunnel hosts are allowed explicitly; arbitrary Host headers are not.
const tunnelHosts = ['.trycloudflare.com'];
export default defineConfig({
  plugins: [productionAssets()],
  server: { host: '127.0.0.1', port: 5173, strictPort: true, allowedHosts: tunnelHosts },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true, allowedHosts: tunnelHosts },
  build: { target: ['es2018', 'safari13'], minify: 'esbuild', copyPublicDir: false },
});
