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
