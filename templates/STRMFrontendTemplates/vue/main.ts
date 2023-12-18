/**
 * @author SaiForceOne/ST🌀RM Stack CLI
 * @description Main entry point for a Vue application within the ST🌀RM Stack
 */

// Core & third-party imports
import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import {
  BiStarFill,
  SiVuedotjs,
  SiVite,
  SiMongodb,
  SiGithub,
  SiDiscord,
  SiTailwindcss,
} from 'oh-vue-icons/icons';

// ST🌀RM Stack Imports
import { buildRoutes } from '🌀/routes';
import App from './App.vue';
// Import the 404 - Not Found component
import NotFound from '🌀/components/shared/NotFound.vue';

/**
 * @description Defines the application routes as an array
 */
const routes: Array<RouteRecordRaw> = [
  /**
   * 📝 Developer Note:
   * Unpack the auto-generated routes. These routes are generated from ST🌀RM Modules
   */
  ...buildRoutes(),
  /**
   * 📝 Developer Note:
   * Add custom / catch all routes below
   */
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
];

/**
 * Main application router for the frontend of this ST🌀RM Stack application
 *
 * 📝 Developer Note:
 * you can make changes here as needed. Routes can be manually added to storm_modules/storm_modules.json if necessary.
 * Refer to the ST🌀RM Stack CLI manual for more details on how to manually add frontend routes.
 * Please note that when the CLI generates a ST🌀RM module, the contents of the storm_modules.json file will be updated
 * accordingly.
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

/**
 * Add Icons for the Welcome page
 *
 * 📝 Developer Note:
 * You can continue to use oh-vue-icons or completely remove it from your project and
 * provide your own icons.
 * */
addIcons(
  SiVite,
  SiTailwindcss,
  SiMongodb,
  SiDiscord,
  SiVuedotjs,
  SiGithub,
  BiStarFill
);

createApp(App).use(router).component('v-icon', OhVueIcon).mount('#app');
