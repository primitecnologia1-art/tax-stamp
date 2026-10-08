import { defineConfig } from 'vite';

// Quick Tunnel hosts are allowed explicitly; arbitrary Host headers are not.
const tunnelHosts = ['.trycloudflare.com'];
export default defineConfig({
  server: { host: '127.0.0.1', port: 5173, strictPort: true, allowedHosts: tunnelHosts },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true, allowedHosts: tunnelHosts },
  build: { target: 'es2022', minify: 'esbuild' },
});
