/**
 * @author SaiForceOne
 * @description Base vite config file for React
 * */
import * as path from 'path';
import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import smrtConfig from './smrt_config/smrt_config.json';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    viteReact({
      include: '**/*.disabled',
    }),
  ],
  root: path.resolve(`${smrtConfig.smrtFrontendBasePath}`),
  base: '/static/',
  server: {
    host: 'localhost',
    port: smrtConfig ? smrtConfig.smrtVitePort : 3003,
    open: false,
    watch: {
      usePolling: true,
      disableGlobbing: false,
    },
  },
  resolve: {
    alias: {
      // just because we can emoji (but you should probably use the @strm alias instead)
      '🌀': path.resolve(__dirname, `./${smrtConfig.smrtFrontendBasePath}/src`),
      // you should probably use this instead
      '@strm': path.resolve(
        __dirname,
        `./${smrtConfig.smrtFrontendBasePath}/src`
      ),
    },
    extensions: smrtConfig.smrtFrontendExtensions,
  },
  build: {
    outDir: path.resolve(`./static/dist/js`),
    assetsDir: '',
    manifest: true,
    emptyOutDir: true,
    target: 'es2016',
    rollupOptions: {
      input: {
        main: path.resolve(
          `./${smrtConfig.smrtFrontendBasePath}/src/${smrtConfig.smrtFrontendEntryPoint}`
        ),
      },
      output: {
        chunkFileNames: undefined,
      },
    },
  },
});
