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
import { ERR_PROJECT_DEST_EXISTS } from '../constants/errorConstants.js';
import { ConsoleLogger } from './consoleLogger.js';
import {
  FOLDER_NAME_SUPPORT,
  FOLDER_NAME_TEMPLATES,
  FTL_APP_CORE_TEMPLATE_PATH,
  FTL_BASE_TEMPLATE_PATH,
  FTL_FLASK_CORE_DEPS_FILE,
  FTL_VITE_TAGS_PATH,
} from '../constants/pathConstants.js';
import { CMD_PIPENV_INSTALL } from '../constants/commandConstants.js';
import {
  SUCCESS_BE_FINISHED_VIRTUAL_ENV,
  INFO_BE_SET_UP_VIRTUAL_ENV,
  INFO_BE_COPY_CORE_FILES,
  SUCCESS_BE_COPY_CORE_FILES,
  INFO_BE_COPY_BASE_TEMPLATE,
  SUCCESS_BE_COPY_BASE_TEMPLATE,
  INFO_BE_COPY_SUPPORT_FILES,
  SUCCESS_BE_COPY_SUPPORT_FILES,
  INFO_CHANGING_DIRECTORY_TO,
  SUCCESS_PROJECT_DIR_OK,
} from '../constants/stringConstants.js';

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
      output.message = ERR_PROJECT_DEST_EXISTS;
      // exit
      return output;
    }

    // 2. make target directory
    await mkdir(targetPath);

    // 3. check destination access
    await access(targetPath, constants.W_OK);

    output.message = SUCCESS_PROJECT_DIR_OK;
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
      ConsoleLogger.printLog(`${INFO_CHANGING_DIRECTORY_TO} ${projectPath}`);

    // 1. cd / navigate to project path
    process.chdir(projectPath);

    // 2. execute command to create environment
    if (verboseLogs) ConsoleLogger.printLog(INFO_BE_SET_UP_VIRTUAL_ENV);

    // 3. load flask dependencies and install them
    const currentUrl = import.meta.url;

    const flaskCoreDepsPath = path.resolve(
      path.normalize(new URL(currentUrl).pathname),
      FTL_FLASK_CORE_DEPS_FILE
    );

    // read the file contents
    const pkgFile = await readFile(flaskCoreDepsPath, { encoding: 'utf-8' });
    const pkgData = JSON.parse(pkgFile) as FTLPackageFile;
    const { packages } = pkgData;

    // construct install string for dependencies
    const installString = Object.keys(packages)
      .map((pkg) => pkg)
      .join(' ');

    if (verboseLogs) ConsoleLogger.printLog(INFO_BE_SET_UP_VIRTUAL_ENV);

    const installDepsCommandStr = `${CMD_PIPENV_INSTALL} ${installString}`;

    // execute install command
    await execaCommand(installDepsCommandStr);

    if (verboseLogs)
      ConsoleLogger.printLog(SUCCESS_BE_FINISHED_VIRTUAL_ENV, 'success');

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
      FTL_APP_CORE_TEMPLATE_PATH
    );

    if (verboseLogs) ConsoleLogger.printLog(INFO_BE_COPY_CORE_FILES);

    await copy(coreAppFilesPath, projectPath, { recursive: true });

    if (verboseLogs)
      ConsoleLogger.printLog(SUCCESS_BE_COPY_CORE_FILES, 'success');

    // 3. copy base template files
    const baseTemplatePath = path.resolve(
      normalizedPath,
      FTL_BASE_TEMPLATE_PATH
    );

    const appTemplateDestPath = path.join(projectPath, FOLDER_NAME_TEMPLATES);

    if (verboseLogs) ConsoleLogger.printLog(INFO_BE_COPY_BASE_TEMPLATE);

    await copy(baseTemplatePath, appTemplateDestPath, { recursive: true });

    if (verboseLogs)
      ConsoleLogger.printLog(SUCCESS_BE_COPY_BASE_TEMPLATE, 'success');

    // 4. copy support files
    const supportFilesTemplatePath = path.resolve(
      normalizedPath,
      FTL_VITE_TAGS_PATH
    );

    const supportFilesDestPath = path.join(projectPath, FOLDER_NAME_SUPPORT);

    if (verboseLogs) ConsoleLogger.printLog(INFO_BE_COPY_SUPPORT_FILES);

    await copy(supportFilesTemplatePath, supportFilesDestPath, {
      recursive: true,
    });

    if (verboseLogs)
      ConsoleLogger.printLog(SUCCESS_BE_COPY_SUPPORT_FILES, 'success');

    // hand off to scaffold core function
    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}
