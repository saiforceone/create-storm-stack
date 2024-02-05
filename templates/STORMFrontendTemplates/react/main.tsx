/**
 * @author SaiForceOne
 * @description This is the main entry point for the frontend of the S.T.🌀.R.M Stack. Feel free to edit this as necessary
 * to better fit your project as this only represents the starting point
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';

/**
 * Developer Note: Uncomment the lines below if you are using Sentry for logging or delete them if not
 */
// import * as Sentry from '@sentry/react';
// Sentry.init({
//   dsn: "", // Add your DSN here from Sentry
//   integrations: [
//     new Sentry.BrowserTracing({
//       // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
//       tracePropagationTargets: ["localhost"],
//     }),
//     new Sentry.Replay({
//       maskAllText: false,
//       blockAllMedia: false,
//     }),
//   ],
//   // Performance Monitoring
//   tracesSampleRate: 1.0, //  Capture 100% of the transactions
//   // Session Replay
//   replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
//   replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
// });

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
