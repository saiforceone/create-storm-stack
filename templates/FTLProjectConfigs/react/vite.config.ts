/*
 * @author SaiForceOne
 * @description Default vite.config.ts file to run FTL Stack applications. These
 * should be sensible defaults to get your on your way. That said, feel free
 * to modify or change things as needed or not.
 * */
import * as path from 'path';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import flakConfig from './flak_config/flak_config.json';

export default defineConfig({
  plugins: [
    react({
      include: '**/*.disabled',
    }),
  ],
  root: resolve(`./${flakConfig.flakFrontendBasePath}`),
  base: '/static/',
  server: {
    host: 'localhost',
    port: flakConfig ? flakConfig.flakVitePort : 3003,
    open: false,
    watch: {
      usePolling: true,
      disableGlobbing: false,
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, `./${flakConfig.flakFrontendBasePath}/src`),
    },
    extensions: flakConfig.flakFrontendExtensions,
  },
  build: {
    outDir: resolve(`./${flakConfig.flakFrontendBasePath}/dist`),
    assetsDir: '',
    manifest: true,
    emptyOutDir: true,
    target: 'es2016',
    rollupOptions: {
      input: {
        main: resolve(
          `./${flakConfig.flakFrontendBasePath}/src/${flakConfig.flakFrontendEntryPoint}`
        ),
      },
      output: {
        chunkFileNames: undefined,
      },
    },
  },
});
