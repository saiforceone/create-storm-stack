/**
 * @author SaiForceOne
 * @description builds the routes at runtime for ST🌀RM application
 */

// Core & third-party imports
import { RouteRecordRaw } from 'vue-router';

// ST🌀RM Stack imports
import { STORMApp } from '🌀/@types/storm_fe';
import _stormResources from '../../../storm_modules/storm_modules.json';

/**
 * @function buildRoutes
 * @description Helper function that provides dynamic routes for ST🌀RM application
 * @returns {Array<RouteRecordRaw>} the list of routes
 */
export function buildRoutes(): Array<RouteRecordRaw> {
  const stormModules = _stormResources as STORMApp.STORMModulesFile;
  const output: Array<RouteRecordRaw> = [];

  for (const moduleKey of Object.keys(stormModules.modules)) {
    const module = stormModules.modules[moduleKey] as STORMApp.STORMModule;
    for (const page of module.pages) {
      output.push({
        name: page.componentName,
        path: page.path,
        component: () =>
          import(/*@vite-ignore*/ `../pages/${page.componentPath}.vue`),
      });
    }
  }

  return output;
}
