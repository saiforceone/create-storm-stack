/**
 * @author SaiForceOne
 * @description a collection of utility functions related to the scaffolding
 * process
 */

// Core & third-party imports
import path from 'node:path';
import {
  access,
  constants,
  cp as copy,
  mkdir,
  readFile,
} from 'node:fs/promises';
import { execaCommand } from 'execa';

// FTL Imports
import ScaffoldOutput = FTLStackCLI.ScaffoldOutput;
import LoggerMode = FTLStackCLI.LoggerMode;
import FTLPackageFile = FTLStackCLI.FTLPackageFile;
import { buildScaffoldOutput } from './generalUtils.js';
import { destinationPathExists } from './fileUtils.js';
import { PROJECT_DEST_EXISTS } from '../constants/errorConstants.js';
import { ConsoleLogger } from './consoleLogger.js';

/**
 * @function setupProjectDir
 * @param {string} projectName
 * @description Sets up the project destination directory
 */
export async function setupProjectDir(
  projectName: string
): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  try {
    // 0. check that the destination does not already exist
    const targetPath = path.join(process.cwd(), projectName);

    // 1. check the destination
    if (await destinationPathExists(targetPath)) {
      output.message = 'Project destination already exists';
      // exit
      return output;
    }

    // 2. make target directory
    await mkdir(targetPath);

    // 3. check destination access
    await access(targetPath, constants.W_OK);

    output.message = PROJECT_DEST_EXISTS;
    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}

/**
 * @async
 * @function setupVirtualEnv
 * @param projectPath
 * @param loggerMode
 * @description Executes the commands necessary to set up a virtual environment
 * and installs the necessary dependencies
 */
export async function setupVirtualEnv(
  projectPath: string,
  loggerMode: LoggerMode
): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  const verboseLogs = loggerMode === 'verbose';
  try {
    if (verboseLogs)
      ConsoleLogger.printLog(`Changing directory to: ${projectPath}`);

    // 1. cd / navigate to project path
    process.chdir(projectPath);

    // 2. execute command to create environment
    if (verboseLogs)
      ConsoleLogger.printLog('Setting up virtual environment...');

    // 3. load flask dependencies and install them
    const currentUrl = import.meta.url;

    const flaskCoreDepsPath = path.resolve(
      path.normalize(new URL(currentUrl).pathname),
      '../../../configs/flaskCoreDependencies.json'
    );

    // read the file contents
    const pkgFile = await readFile(flaskCoreDepsPath, { encoding: 'utf-8' });
    const pkgData = JSON.parse(pkgFile) as FTLPackageFile;
    const { packages } = pkgData;

    // construct install string for dependencies
    const installString = Object.keys(packages)
      .map((pkg) => pkg)
      .join(' ');

    if (verboseLogs)
      ConsoleLogger.printLog(
        'Setting up virtual environment and installing Flask dependencies...'
      );

    const installDepsCommandStr = `pipenv install ${installString}`;

    // execute install command
    await execaCommand(installDepsCommandStr);

    if (verboseLogs)
      ConsoleLogger.printLog(
        'Finished setting up virtual environment and installing Flask dependencies',
        'success'
      );

    // 4. hand off to scaffold core function
    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}

/**
 * @function copyFlaskTemplateFiles
 * @param projectPath
 * @param loggerMode
 * @description copies required flask template files to the project directory
 */
export async function copyFlaskTemplateFiles(
  projectPath: string,
  loggerMode: LoggerMode
): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  const verboseLogs = loggerMode === 'verbose';
  try {
    // 1. get the path to the template files to copy
    const currentPath = import.meta.url;
    const normalizedPath = path.normalize(new URL(currentPath).pathname);

    // 2. copy core files
    const coreAppFilesPath = path.resolve(
      normalizedPath,
      '../../../templates/FTLAppCore'
    );

    if (verboseLogs)
      ConsoleLogger.printLog('Copying core app files to destination...');

    await copy(coreAppFilesPath, projectPath, { recursive: true });

    if (verboseLogs)
      ConsoleLogger.printLog('Copied core app files to destination', 'success');

    // 3. copy base template files
    const baseTemplatePath = path.resolve(
      normalizedPath,
      '../../../templates/FTLBaseTemplates'
    );

    const appTemplateDestPath = path.join(projectPath, 'templates');

    if (verboseLogs)
      ConsoleLogger.printLog('Copying base template to destination...');

    await copy(baseTemplatePath, appTemplateDestPath, { recursive: true });

    if (verboseLogs)
      ConsoleLogger.printLog('Copied base template to destination', 'success');

    // 4. copy support files
    const supportFilesTemplatePath = path.resolve(
      normalizedPath,
      '../../../templates/FTLViteTags'
    );

    const supportFilesDestPath = path.join(projectPath, 'support');

    if (verboseLogs)
      ConsoleLogger.printLog('Copying support files to destination...');

    await copy(supportFilesTemplatePath, supportFilesDestPath, {
      recursive: true,
    });

    if (verboseLogs)
      ConsoleLogger.printLog('Copied support files to destination', 'success');

    // hand off to scaffold core function
    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}
