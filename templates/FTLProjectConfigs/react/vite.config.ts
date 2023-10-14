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
import ftlConfig from './ftl_config/ftl_config.json';

export default defineConfig({
  plugins: [
    react({
      include: '**/*.disabled',
    }),
  ],
  root: resolve(`./${ftlConfig.ftlFrontendBasePath}`),
  base: '/static/',
  server: {
    host: 'localhost',
    port: ftlConfig ? ftlConfig.ftlVitePort : 3003,
    open: false,
    watch: {
      usePolling: true,
      disableGlobbing: false,
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, `./${ftlConfig.ftlFrontendBasePath}/src`),
    },
    extensions: ftlConfig.ftlFrontendExtensions,
  },
  build: {
    outDir: resolve(`./${ftlConfig.ftlFrontendBasePath}/dist`),
    assetsDir: '',
    manifest: true,
    emptyOutDir: true,
    target: 'es2016',
    rollupOptions: {
      input: {
        main: resolve(
          `./${ftlConfig.ftlFrontendBasePath}/src/${ftlConfig.ftlFrontendEntryPoint}`
        ),
      },
      output: {
        chunkFileNames: undefined,
      },
    },
  },
});
