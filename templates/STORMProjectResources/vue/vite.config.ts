/**
 * @author SaiForceOne
 * @description Base vite config file for Vue
 * */
import * as path from 'path';
import { defineConfig } from 'vite';
import vuePlugin from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';
import stormConfig from './storm_config/storm_config.json';

export default defineConfig({
  plugins: [tsconfigPaths(), vuePlugin()],
  root: path.resolve(`${stormConfig.frontendBasePath}`),
  base: '/static/',
  server: {
    host: 'localhost',
    port: stormConfig ? stormConfig.vitePort : 3003,
    open: false,
    watch: {
      usePolling: true,
      disableGlobbing: false,
    },
  },
  resolve: {
    alias: {
      // just because we can emoji (but you should probably use the @storm alias instead)
      '🌀': path.resolve(__dirname, `./${stormConfig.frontendBasePath}/src`),
      // you should probably use this instead
      '@storm': path.resolve(
        __dirname,
        `./${stormConfig.frontendBasePath}/src`
      ),
    },
    extensions: stormConfig.frontendExtensions,
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
          `./${stormConfig.frontendBasePath}/src/${stormConfig.frontendEntryPoint}`
        ),
      },
      output: {
        chunkFileNames: undefined,
      },
    },
  },
});
