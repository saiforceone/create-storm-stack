/**
 * @author SaiForceOne
 * @description This represents an error element for 404-type errors. You are expected
 * to customize this to your own specifications or to fit with your app design. The name
 * of this component does not need to be changed.
 */

// Core imports
import React from 'react';
import { Link } from 'react-router-dom';


const PAGE_TITLE = 'ST🌀RM';

/**
 * @function NotFoundErrorBoundary
 * @description Defines an error component to be shown for 404 type errors in
 * our React application. You only need to customize the markup returned by this
 * component
 * @constructor
 * @returns {React.ReactElement}
 */
function NotFoundErrorBoundary(): React.ReactElement {
  // 📝 Developer Note: You generally only need to change what is returned from
  // this function below
  return (
    <div
      className='w-full min-h-screen text-white flex flex-col bg-gradient-to-b from-strm-bg-dark to-strm-bg-lighter p-2'>
      <div className='flex flex-col gap-y-4'>
        <h1 className='font-heading text-4xl text-center'>{PAGE_TITLE} Stack</h1>
        <p className='text-lg text-center'>
          The 🌀 blew away the component you are looking for 🙃
        </p>
        <img src='/static/dist/images/404-not-found.jpg' alt='404 not found' />
        <h2 className='text-2xl text-center font-heading'>What to do next?</h2>
        <div className='flex flex-col items-center gap-y-2'>

          <Link className='text-center w-fit hover:underline' to='/'>Navigate to Home</Link>
          <p className='text-center'>You should probably update this component to better fit your app's overall theme.
            The
            component can be
            edited: <span
              className='px-1 py-0.5 italic rounded-sm text-white bg-strm-bg-dark'>strm_fe_react/src/components/shared/NotFoundErrorBoundary.tsx</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFoundErrorBoundary;
