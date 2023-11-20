/**
 * @author SaiForceOne
 * @description builds the routes at runtime for ST🌀RM application
 */

// Core & third-party imports
import {RouteRecordRaw} from "vue-router";

// ST🌀RM Stack imports
import routeListing from './_routes.json';
import {STRMApp} from "🌀/@types/strm_fe";

/**
 * @function buildRoutes
 * @description Helper function that provides dynamic routes for ST🌀RM application
 * @returns {Array<RouteRecordRaw>} the list of routes
 */
export function buildRoutes(): Array<RouteRecordRaw> {
  const _routes = routeListing as Array<STRMApp.StrmFERoute>;
  const output: Array<RouteRecordRaw> = [];
  for (const routeObj of _routes) {
    output.push({
      name: routeObj.componentName,
      path: routeObj.path,
      component: () => import(/*@vite-ignore*/`../pages/${routeObj.componentPath}.vue`)
    });
  }
  return output;
}
