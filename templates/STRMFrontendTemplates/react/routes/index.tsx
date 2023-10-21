/**
 * @description Contains the routes of the application which will be exported as a constant.
 * The exported list will be consumed by a route generator function which builds the route elements
 */
// Core & third-party imports
import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// S.T.R.M Stack Imports
import { STRMApp } from '../@types/strm_fe';
import _routes from './_routes.json';

/**
 * @async
 * @description Returns a list of application routes based on the contents of _routes.json which is generated
 * when a new controller or page component is generated.
 * @returns {Array<RouteObject>}
 */
export function buildRoutes(): Array<RouteObject> {
  const routes = _routes as Array<STRMApp.StrmFERoute>;
  const output: Array<RouteObject> = [];

  for (const r of routes) {
    // Todo: Currently, Vite doesn't like our dynamic import. Will look for a solution
    const Element = lazy(
      () => import(/* @vite-ignore */ `../pages/${r.componentPath}`)
    );

    const _route: RouteObject = {
      element: <Element />,
      id: r.componentName,
      path: r.path,
    };

    output.push(_route);
  }
  return output;
}
