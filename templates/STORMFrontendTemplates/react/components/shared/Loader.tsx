/**
 * @author SaiForceOne
 * @description Default loader component that indicates loading state of the application
 */

// Core & third-party import
import React from 'react';

/**
 * @constructor
 * @description Returns a loader component that goes along with our React.Suspense
 * todo: make this fancy later
 */
function Loader(): React.ReactElement {
  return (
    <div className="p-4">
      <p>Loading the things...</p>
    </div>
  );
}

export default Loader;
