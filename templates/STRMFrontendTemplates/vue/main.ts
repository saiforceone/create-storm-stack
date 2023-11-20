/**
 * @author SaiForceOne/ST🌀RM Stack CLI
 * @description Main entry point for a Vue application within the ST🌀RM Stack
 */

// Core & third-party imports
import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
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

/**
 * Main application router for the frontend of this ST🌀RM Stack application
 *
 * Developer Note:
 * you can make changes here as needed. Routes can be manually added to routes/_routes.json if necessary.
 * Please note that when the CLI generates a new route, the contents of the _routes.json file will be updated
 * accordingly.
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: buildRoutes(),
});

/**
 * Add Icons for the Welcome page
 *
 * Developer Note:
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
