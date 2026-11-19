import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const envDir = path.resolve(__dirname, '../../');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, envDir, '');
  const apiUrl = env.VITE_API_URL || 'http://localhost:5000';
  // Proxy target must be the origin only (strip any path like /api/v1)
  const apiTarget = new URL(apiUrl).origin;

  return {
    plugins: [react()],
    envDir,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@fh6-cars/shared': path.resolve(__dirname, '../../packages/shared/src/index.ts'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
