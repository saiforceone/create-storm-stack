/**
 * @author SaiForceOne
 * @description Base vite config file for Vue
 * */
import * as path from 'path';
import { defineConfig } from 'vite';
import vuePlugin from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';
import strmConfig from './strm_config/strm_config.json';

export default defineConfig({
  plugins: [tsconfigPaths(), vuePlugin()],
  root: path.resolve(`${strmConfig.frontendBasePath}`),
  base: '/static/',
  server: {
    host: 'localhost',
    port: strmConfig ? strmConfig.vitePort : 3003,
    open: false,
    watch: {
      usePolling: true,
      disableGlobbing: false,
    },
  },
  resolve: {
    alias: {
      // just because we can emoji (but you should probably use the @strm alias instead)
      '🌀': path.resolve(__dirname, `./${strmConfig.frontendBasePath}/src`),
      // you should probably use this instead
      '@strm': path.resolve(__dirname, `./${strmConfig.frontendBasePath}/src`),
    },
    extensions: strmConfig.frontendExtensions,
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
          `./${strmConfig.frontendBasePath}/src/${strmConfig.frontendEntryPoint}`
        ),
      },
      output: {
        chunkFileNames: undefined,
      },
    },
  },
});
