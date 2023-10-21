/**
 * @author SaiForceOne
 * @description This is the main entry point for the frontend of the S.T.🌀.R.M Stack. Feel free to edit this as necessary
 * to better fit your project as this only represents the starting point
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// import routes
import { WelcomeIndex } from './pages/Welcome/Index';

const container = document.getElementById('app')!;

const router = createBrowserRouter([
  {
    path: '/',
    element: <WelcomeIndex />,
  },
]);

createRoot(container).render(
  <>
    <RouterProvider router={router} />
  </>
);
