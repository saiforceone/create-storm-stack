/**
 * @author SaiForceOne
 * @description Contains ST🌀RM Stack add on installation functions
 */

// core & third-party imports
import path from 'node:path';
import {readFile, cp as copyFile, appendFile} from 'node:fs/promises';
import {execaCommand} from 'execa';

// ST🌀RM Stack imports
import STORMAddOnsFile = STORMStackCLI.STORMAddOnsFile;
import ScaffoldOutput = STORMStackCLI.ScaffoldOutput;
import {buildScaffoldOutput} from './generalUtils.js';
import {COMMAND_CONSTANTS} from '../constants/commandConstants.js';
import {getSTORMCLIRoot, normalizeWinFilePath} from './fileUtils.js';
import {LocaleManager} from '../cliHelpers/localeManager.js';
import {platform} from 'os';
import {PATH_CONSTANTS} from "../constants/pathConstants.js";
import STORMBackendAddonsFile = STORMStackCLI.STORMBackendAddonsFile;
import FrontendOpt = STORMStackCLI.FrontendOpt;
import STORMSpecificFrontendAddonsFile = STORMStackCLI.STORMSpecificFrontendAddonsFile;

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
 *
 * @param currentUrl
 * @param isWindows
 * @param projectPath
 */
async function installSentryForBackend(currentUrl: string, isWindows: boolean, projectPath: string): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  try {

    let webCoreAddonsPath = path.resolve(
      new URL(currentUrl).pathname,
      PATH_CONSTANTS.PATH_WEB_CORE_ADDONS
    );

    if (isWindows)
      webCoreAddonsPath = normalizeWinFilePath(webCoreAddonsPath);

    // read file
    const fileDataString = await readFile(webCoreAddonsPath, {encoding: 'utf-8'});
    const webCoreAddonsData = JSON.parse(fileDataString) as STORMBackendAddonsFile;
    const sentryPkg = webCoreAddonsData.sentry.packages;
    const installString = `${COMMAND_CONSTANTS.CMD_PIPENV_INSTALL} ${Object.keys(sentryPkg).map(s => `${s}`).join(' ')}`


    // install dependency in backend
    await execaCommand(installString)

    // copy file `storm_addons/addon_sentry.py` with contents
    let sentryAddonTemplatePath = path.resolve(
      new URL(currentUrl).pathname,
      PATH_CONSTANTS.PATH_STORM_ADDONS,
      'sentry',
      'addon_sentry.py',
    );

    if (isWindows)
      sentryAddonTemplatePath = normalizeWinFilePath(sentryAddonTemplatePath);

    let stormProjectAddonsPath = path.resolve(
      projectPath,
      'storm_addons',
      'addon_sentry.py'
    );

    if (isWindows)
      stormProjectAddonsPath = normalizeWinFilePath(stormProjectAddonsPath);

    // copy addons file to destination
    await copyFile(sentryAddonTemplatePath, stormProjectAddonsPath);

    // update contents of storm_addons/__init__.py
    let stormAddonsAutoloadPath = path.resolve(
      projectPath,
      'storm_addons',
      '__init__.py',
    );

    if (isWindows) stormAddonsAutoloadPath = normalizeWinFilePath(stormAddonsAutoloadPath);

    await appendFile(stormAddonsAutoloadPath, `\nfrom .addon_sentry import *\n`);
    output.success = true;
    return output;
  } catch (e) {

    output.message = (e as Error).message;
    return output;
  }
}

/**
 * @function installSentryForFrontend
 * @description Utility function that installs Sentry in the frontend for the frontend during the scaffolding process
 * @param {string} projectPath the path of the scaffolded project
 * @param {FrontendOpt} frontendOpt the frontend that Sentry should be installed for
 */
export async function installSentryForFrontend(projectPath: string, frontendOpt: FrontendOpt): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  const isWindows = platform() === 'win32';
  try {

    const currentUrl = import.meta.url;
    let frontendAddonsFilePath = path.resolve(
      new URL(currentUrl).pathname,
      PATH_CONSTANTS.PATH_FRONTEND_SPECIFIC_ADDONS,
    );

    if (isWindows) frontendAddonsFilePath = normalizeWinFilePath(frontendAddonsFilePath);
    const frontendAddonsData = await readFile(frontendAddonsFilePath, {encoding: 'utf-8'});
    const frontendAddonsPkg = JSON.parse(frontendAddonsData) as STORMSpecificFrontendAddonsFile;

    if (!frontendAddonsPkg) {
      output.message = 'Failed to read package data';
      return output;
    }

    // build the installation string for the platform
    const fePackages = frontendAddonsPkg.sentry[frontendOpt].packages;
    const pkgString = Object.keys(fePackages).map(p => `${p}@${fePackages[p]}`).join(' ');
    const installationString = `${COMMAND_CONSTANTS.CMD_NPM_DEV_INSTALL} ${pkgString}`;

    await execaCommand(installationString);

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
 * @description Utility function that install Sentry in the project during the scaffolding process for the
 * backend and frontend
 */
export async function installSentry(projectPath: string): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  const isWindows = platform() === 'win32';
  try {

    const currentUrl = import.meta.url;

    // install sentry for backend
    const installBEResult = await installSentryForBackend(currentUrl, isWindows, projectPath);

    if (!installBEResult.success) {
      output.message = installBEResult.message;
      return output;
    }

    // install dependency in frontend

    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}