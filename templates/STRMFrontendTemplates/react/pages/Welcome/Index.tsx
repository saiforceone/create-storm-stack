/**
 * @author SaiForceOne
 * @description Represents the main page component of the application.
 * You should edit or completely replace this with something that better fits your project.
 * */
// Core & third-party imports
import React, { useEffect, useState } from 'react';
import {
  SiMongodb,
  SiReact,
  SiTailwindcss,
  SiVite,
  SiGit,
  SiDiscord,
} from '@icons-pack/react-simple-icons';

// ST🌀RM Stack Imports
import { STRMApp } from '🌀/@types/strm_fe';
import strmConfig from '../../../../strm_config/strm_config.json';

const PAGE_TITLE = 'ST🌀RM';
const TECH_ICON_SIZE = 32;
const CONTACT_ICON_SIZE = 24;

/**
 * @function HighlightedText
 * @param content
 * @constructor
 * @description Temporary component for displaying highlighted text
 */
const HighlightedText: React.FC<{ content: string }> = ({
  content,
}): React.ReactElement => {
  return (
    <span className="bg-strm-bg-lighter p-1 rounded text-white font-medium">
      {content}
    </span>
  );
};

/**
 * @async
 * @description Retrieves API data for the welcome page component from the WelcomeController
 * @returns {Promise<STRMApp.BaseAPIResponse>}
 */
async function getWelcomeData(): Promise<STRMApp.BaseAPIResponse> {
  const url = '/api/welcome';
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
function WelcomeIndex(): React.ReactElement {
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
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-strm-bg-dark to-strm-bg-lighter p-2">
      <header className="text-center text-white mt-4 w-full md:container md:mx-auto md:self-center">
        <h1 className="text-3xl md:text-6xl font-heading text-white">
          {PAGE_TITLE} Stack
        </h1>
        <p className="text-lg mt-1">Make fullstack web applications a breeze</p>
        <p className="text-lg text-white mt-6">
          Welcome to the {PAGE_TITLE} Stack. A different way to build
          python-based fullstack web applications with Reactive UIs
        </p>
      </header>
      {apiData && (
        <section
          className="rounded bg-white p-4 w-full md:w-4/5 self-center my-4"
          id="strm-api-response"
        >
          <h2 className="font-heading font-bold text-2xl">
            {PAGE_TITLE} Welcome API Response
          </h2>
          <p className="text-lg">Here is an example of an API response</p>
          <div className="rounded bg-strm-bg-lighter p-4 text-white">
            {JSON.stringify(apiData)}
          </div>
          <p className="mt-2">
            * API functions can be found at:{' '}
            <HighlightedText content="strm_controllers/[controller_name]" />
          </p>
        </section>
      )}
      <section
        className="rounded bg-white p-4 w-full md:w-4/5 self-center"
        id="strm-do-next"
      >
        <h2 className="font-heading font-bold text-2xl">Project Details</h2>
        <div className="grid grid cols-1 my-2 gap-1">
          <p className="font-bold">
            Project Name: <HighlightedText content={strmConfig.appId} />
          </p>
          <p className="font-bold">
            Frontend: <HighlightedText content={strmConfig.frontend} />
          </p>
        </div>
        <h2 className="font-heading font-bold text-2xl">What to do next</h2>
        <p className="text-lg mt-2">
          Now that your {PAGE_TITLE} Stack project is running, consider doing
          the following:
        </p>
        <div className="grid grid-cols-1 gap-1 mt-2">
          <p>
            1. Edit or replace this page found at:{' '}
            <HighlightedText
              content={`${strmConfig.frontendBasePath}/src/pages/Welcome/Index.tsx`}
            />
          </p>
          <p>
            2. Create a controller:{' '}
            <HighlightedText content="npx @saiforceone/strm-cli --create-controller [controller_name]" />
          </p>
        </div>
        <h4 className="font-heading font-bold mt-4">Other links</h4>
        <p>
          For a more detailed guide or to find out about important files and
          folder, consider reading the getting started guide (coming soon)
        </p>
      </section>
      <section className="text-white mt-10" id="strm-powered">
        <p className="text-lg text-center font-heading font-bold mb-2">
          The {PAGE_TITLE} is powered by
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <div className="flex flex-col items-center">
            <div className="h-8"></div>
            Starlette
          </div>
          <div className="flex flex-col items-center">
            <SiTailwindcss size={TECH_ICON_SIZE} />
            Tailwind CSS
          </div>
          <div className="flex flex-col items-center">
            <SiReact size={TECH_ICON_SIZE} />
            Reactive UI ({strmConfig.frontend})
          </div>
          <div className="flex flex-col items-center">
            <SiMongodb size={TECH_ICON_SIZE} />
            MongoDB
          </div>
        </div>
        <p className="text-lg font-bold font-heading text-center my-4">
          and supercharged by
        </p>
        <div className="flex flex-col items-center">
          <SiVite size={TECH_ICON_SIZE} />
          Vite
        </div>
      </section>
      <footer
        className="mt-4 p-2 text-white flex flex-col items-center "
        id="strm-footer"
      >
        <div className="w-full md:w-2/5 grid grid-cols-2 gap-2">
          <div>
            <a
              className="flex items-center gap-x-1"
              href=""
              title="Link to the Peanut Cart Express Discord"
              target="_blank"
            >
              <SiDiscord size={CONTACT_ICON_SIZE} /> P.C.E Discord
            </a>
          </div>
          <div className="flex ">
            <a
              className="flex items-center gap-x-1"
              title="Link to the STORM Stack on Github"
              href="https://github.com/saiforceone/strm-cli"
              target="_blank"
            >
              <SiGit size={CONTACT_ICON_SIZE} /> {PAGE_TITLE} Stack Git
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default WelcomeIndex;
