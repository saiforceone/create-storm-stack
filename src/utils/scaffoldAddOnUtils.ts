/**
 * @author SaiForceOne
 * @description Contains STRM Stack add on installation functions
 */

// core & third-party imports
import path from 'node:path';
import { readFile, cp as copyFile } from 'node:fs/promises';
import { execaCommand } from 'execa';

// STRM Stack imports
import STRMAddOnsFile = STRMStackCLI.STRMAddOnsFile;
import LoggerMode = STRMStackCLI.LoggerMode;
import ScaffoldOutput = STRMStackCLI.ScaffoldOutput;
import { buildScaffoldOutput } from './generalUtils.js';
import { ConsoleLogger } from './consoleLogger.js';
import { COMMAND_CONSTANTS } from '../constants/commandConstants.js';
import { getSTRMCLIRoot } from './fileUtils.js';

/**
 * @returns {Promise<STRMAddOnsFile|undefined>}
 * @description Helper function that attempts to read the contents of the json
 * file containing project addons
 */
async function getAddOnsFile(): Promise<STRMAddOnsFile | undefined> {
  try {
    const currentUrl = import.meta.url;
    const addOnsPath = path.resolve(
      path.normalize(new URL(currentUrl).pathname),
      '../../../',
      'configs',
      'addOnDependencies.json'
    );

    const fileData = await readFile(addOnsPath, { encoding: 'utf-8' });
    return JSON.parse(fileData) as STRMAddOnsFile;
  } catch (e) {
    return;
  }
}

/**
 *
 * @param {string} projectPath
 * @param {LoggerMode} loggerMode
 * @returns {Promise<ScaffoldOutput>}
 * @description
 */
export async function installPrettier(
  projectPath: string,
  loggerMode: LoggerMode
): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  const verbose = loggerMode === 'verbose';
  try {
    if (verbose) ConsoleLogger.printLog('Installing addon: Prettier...');
    // load dependencies file
    const addOnsData = await getAddOnsFile();

    if (!addOnsData) {
      output.message = 'Failed to load addons file';
      return output;
    }

    const prettierData = addOnsData.prettier;
    const { packages } = prettierData;
    // construct install string
    const installString = Object.keys(packages)
      .map((pkg) => `${pkg}@${packages[pkg]}`)
      .join(' ');

    // exec install
    await execaCommand(
      `${COMMAND_CONSTANTS.CMD_NPM_DEV_INSTALL} ${installString}`
    );

    // build the path
    const templatesPath = path.join(
      getSTRMCLIRoot(),
      'templates/STRMAddOns/prettier'
    );

    // copy template file
    await copyFile(templatesPath, projectPath, { recursive: true });

    if (verbose) ConsoleLogger.printLog('Installed addon: Prettier', 'success');
    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}
