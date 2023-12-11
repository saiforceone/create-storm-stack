/**
 * @author SaiForceOne
 * @description Contains the routes of the application which will be exported as a constant.
 * The exported list will be consumed by a route generator function which builds the route elements
 */
// Core & third-party imports
import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// S.T.🌀.R.M Stack Imports
import { STRMApp } from '🌀/@types/strm_fe';
import _strmResources from '../../../strm_modules/strm_modules.json';
import NotFoundErrorBoundary from '🌀/components/shared/NotFoundErrorBoundary';

/**
 * @async
 * @description Returns a list of application routes based on the contents of resources.json which is generated
 * when a new controller or page component is generated.
 * @returns {Array<RouteObject>}
 */
export function buildRoutes(): Array<RouteObject> {
  const strmModules = _strmResources as STRMApp.STRMModulesFile;
  const output: Array<RouteObject> = [];

  for (const moduleKey of Object.keys(strmModules.modules)) {
    const module = strmModules.modules[moduleKey] as STRMApp.STRMModule;
    for (const page of module.pages) {
      const Element = lazy(
        () => import(/*@vite-ignore*/ `../pages/${page.componentPath}`)
      );

      const _route: RouteObject = {
        element: <Element />,
        id: page.componentName,
        path: page.path,
        errorElement: <NotFoundErrorBoundary />,
      };

      output.push(_route);
    }
  }

  return output;
}
