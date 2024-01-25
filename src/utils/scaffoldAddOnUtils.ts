/**
 * @author SaiForceOne
 * @description Contains ST🌀RM Stack add on installation functions
 */

// core & third-party imports
import path from 'node:path';
import {readFile, cp as copyFile} from 'node:fs/promises';
import {execaCommand} from 'execa';

// ST🌀RM Stack imports
import STORMAddOnsFile = STORMStackCLI.STORMAddOnsFile;
import ScaffoldOutput = STORMStackCLI.ScaffoldOutput;
import {buildScaffoldOutput} from './generalUtils.js';
import {COMMAND_CONSTANTS} from '../constants/commandConstants.js';
import {getSTORMCLIRoot, normalizeWinFilePath} from './fileUtils.js';
import {LocaleManager} from '../cliHelpers/localeManager.js';
import {platform} from 'os';

/**
 * @returns {Promise<STORMAddOnsFile|undefined>}
 * @description Helper function that attempts to read the contents of the json
 * file containing project addons
 */
async function getAddOnsFile(): Promise<STORMAddOnsFile | undefined> {
  try {
    const currentUrl = import.meta.url;
    let addOnsPath = path.resolve(
      path.normalize(new URL(currentUrl).pathname),
      '../../../',
      'configs',
      'addOnDependencies.json'
    );

    if (platform() === 'win32') addOnsPath = normalizeWinFilePath(addOnsPath);

    const fileData = await readFile(addOnsPath, {encoding: 'utf-8'});
    return JSON.parse(fileData) as STORMAddOnsFile;
  } catch (e) {
    return;
  }
}

/**
 *
 * @param {string} projectPath
 * @returns {Promise<ScaffoldOutput>}
 * @description
 */
export async function installPrettier(
  projectPath: string
): Promise<ScaffoldOutput> {
  const LocaleData = LocaleManager.getInstance().getLocaleData();
  const output = buildScaffoldOutput();
  try {
    // load dependencies file
    const addOnsData = await getAddOnsFile();

    if (!addOnsData) {
      output.message = LocaleData.frontend.error.INSTALL_FE_ADDON;
      return output;
    }

    const prettierData = addOnsData.prettier;
    const {packages} = prettierData;
    // construct install string
    const installString = Object.keys(packages)
      .map((pkg) => `${pkg}@${packages[pkg]}`)
      .join(' ');

    // exec install
    await execaCommand(
      `${COMMAND_CONSTANTS.CMD_NPM_DEV_INSTALL} ${installString}`
    );

    // build the path
    let templatesPath = path.join(
      getSTORMCLIRoot(),
      'templates/STORMAddOns/prettier'
    );

    if (platform() === 'win32')
      templatesPath = normalizeWinFilePath(templatesPath);

    // copy template file
    await copyFile(templatesPath, projectPath, {recursive: true});

    output.message = LocaleData.frontend.success.INSTALL_FE_ADDON;
    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}

/**
 * @function installSentry
 * @param projectPath
 * @description Utility function that install Sentry in the project during the scaffolding process for the backend and frontend
 */
export async function installSentry(projectPath: string): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  try {
    // install dependency in backend
    // create file `storm_addons/addon_sentry.py` with contents

    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}