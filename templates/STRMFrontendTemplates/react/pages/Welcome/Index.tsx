/**
 * @author SaiForceOne
 * @description Represents the main page component of the application.
 * You should edit or completely replace this with something that better fits your project.
 * */
// Core & third-party imports
import React, { useEffect, useState } from 'react';

// STRM Stack imports
import { STRMApp } from '~/@types/strm_fe';

const PAGE_TITLE = 'ST🌀RM';

/**
 * @async
 * @description Retrieves API data for the welcome page component from the WelcomeController
 * @returns {Promise<STRMApp.BaseAPIResponse>}
 */
async function getWelcomeData(): Promise<STRMApp.BaseAPIResponse> {
  const url = '/api';
  const response = await fetch(url);
  return (await response.json()) as STRMApp.BaseAPIResponse;
}

/**
 * @function WelcomeIndex
 * @constructor
 * @description Represents the welcome page shown when a new project is scaffolded from the CLI.
 * You are expected to replace or edit this to better fit your project
 * @return React.ReactElement
 */
export function WelcomeIndex(): React.ReactElement {
  const [apiData, setApiData] = useState<STRMApp.BaseAPIResponse | undefined>();
  const [stackComponents, setStackComponents] = useState<Array<String>>([]);

  useEffect(() => {
    getWelcomeData().then((data) => {
      setApiData(data);
      const componentsData = data.data as {
        stack: Array<STRMApp.APIStackComponent>;
      };
      console.log(componentsData);
      setStackComponents(componentsData.stack.map((item) => item.component));
    });
  }, []);
  return (
    <div>
      <h1 className="text-4xl font-heading">
        Welcome to the {PAGE_TITLE} Stack
      </h1>
      <p className="text-lg text-gray-800">
        Welcome to the STRM (STORM) Stack. A different way to build python-based
        fullstack web applications with Reactive UIs
      </p>
      {stackComponents.length ? (
        <div>
          <h2 className="text-2xl font-heading">
            The {PAGE_TITLE} is made with
          </h2>
          {stackComponents.map((item) => (
            <div className="p-2" key={item}>
              <p>{item}</p>
            </div>
          ))}
        </div>
      ) : undefined}
    </div>
  );
}
