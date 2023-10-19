/*
 * @author SaiForceOne
 * @description Default vite.config.ts file to run STRM Stack applications. These
 * should be sensible defaults to get your on your way. That said, feel free
 * to modify or change things as needed or not.
 * */
import * as path from 'path';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import strmConfig from './strm_config/strm_config.json';

export default defineConfig({
  plugins: [
    react({
      include: '**/*.disabled',
    }),
  ],
  root: resolve(`./${strmConfig.strmFrontendBasePath}`),
  base: '/static/',
  server: {
    host: 'localhost',
    port: strmConfig ? strmConfig.strmVitePort : 3003,
    open: false,
    watch: {
      usePolling: true,
      disableGlobbing: false,
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, `./${strmConfig.strmFrontendBasePath}/src`),
    },
    extensions: strmConfig.strmFrontendExtensions,
  },
  build: {
    outDir: resolve(`./${strmConfig.strmFrontendBasePath}/dist`),
    assetsDir: '',
    manifest: true,
    emptyOutDir: true,
    target: 'es2016',
    rollupOptions: {
      input: {
        main: resolve(
          `./${strmConfig.strmFrontendBasePath}/src/${strmConfig.strmFrontendEntryPoint}`
        ),
      },
      output: {
        chunkFileNames: undefined,
      },
    },
  },
});
