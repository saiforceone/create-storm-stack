/**
 * @author SaiForceOne
 * @description Base vite config file for React
 * */
import * as path from 'path';
import {defineConfig} from 'vite';
import viteReact from '@vitejs/plugin-react';
// Developer Note: uncomment the line below if you are using Sentry or delete if not
// import viteReact from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import stormConfig from './storm_config/storm_config.json';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    viteReact({
      include: '**/*.disabled',
    }),
    // Developer Note: uncomment the lines below if you are using Sentry or delete them if not
    // sentryVitePlugin({
    //   org: "", // Developer Note: Add your Sentry org and project
    //   project: ""
    // }),
  ],
  root: path.resolve(`${stormConfig.frontendBasePath}`),
  base: '/static/',
  server: {
    host: '127.0.0.1',
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
