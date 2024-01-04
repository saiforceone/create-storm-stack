/**
 * @author SaiForceOne
 * @description This is the main entry point for the frontend of the S.T.🌀.R.M Stack. Feel free to edit this as necessary
 * to better fit your project as this only represents the starting point
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';

// import routes
import { buildRoutes } from './routes';
import Loader from '🌀/components/shared/Loader';

// application mount
const container = document.getElementById('app')!;

const ROUTES = buildRoutes();

const router = createHashRouter([
  // Add other routes with higher priority here if they are ever needed
  ...ROUTES,
]);

createRoot(container).render(
  <React.Suspense fallback={<Loader />}>
    <RouterProvider router={router} />
  </React.Suspense>
);
