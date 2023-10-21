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

// STRM STACK Imports
import ScaffoldOutput = STRMStackCLI.ScaffoldOutput;
import LoggerMode = STRMStackCLI.LoggerMode;
import STRMPackageFile = STRMStackCLI.STRMPackageFile;
import { buildScaffoldOutput } from './generalUtils.js';
import {
  destinationPathExists,
  getProjectConfig,
  getProjectPkg,
  writeProjectConfigData,
} from './fileUtils.js';
import { ERROR_CONSTANTS } from '../constants/errorConstants.js';
import { ConsoleLogger } from './consoleLogger.js';
import { PATH_CONSTANTS } from '../constants/pathConstants.js';
import { COMMAND_CONSTANTS } from '../constants/commandConstants.js';
import { STRING_CONSTANTS } from '../constants/stringConstants.js';
import FrontendOpt = STRMStackCLI.FrontendOpt;
import FrontendDependenciesFile = STRMStackCLI.FrontendDependenciesFile;
import ScaffoldOpts = STRMStackCLI.ScaffoldOpts;
import STRMFrontendOptFile = STRMStackCLI.STRMFrontendOptFile;

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
      output.message = ERROR_CONSTANTS.ERR_PROJECT_DEST_EXISTS;
      // exit
      return output;
    }

    // 2. make target directory
    await mkdir(targetPath);

    // 3. check destination access
    await access(targetPath, constants.W_OK);

    output.message = STRING_CONSTANTS.SUCCESS_PROJECT_DIR_OK;
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
      ConsoleLogger.printLog(
        `${STRING_CONSTANTS.INFO_CHANGING_DIRECTORY_TO} ${projectPath}`
      );

    // 1. cd / navigate to project path
    process.chdir(projectPath);

    // 2. execute command to create environment
    if (verboseLogs)
      ConsoleLogger.printLog(STRING_CONSTANTS.INFO_BE_SET_UP_VIRTUAL_ENV);

    // 3. load flask dependencies and install them
    const currentUrl = import.meta.url;

    const flaskCoreDepsPath = path.resolve(
      path.normalize(new URL(currentUrl).pathname),
      PATH_CONSTANTS.FILE_WEB_APP_CORE_DEPS
    );

    // read the file contents
    const pkgFile = await readFile(flaskCoreDepsPath, { encoding: 'utf-8' });
    const pkgData = JSON.parse(pkgFile) as STRMPackageFile;
    const { packages } = pkgData;

    // construct install string for dependencies
    const installString = Object.keys(packages)
      .map((pkg) => pkg)
      .join(' ');

    if (verboseLogs)
      ConsoleLogger.printLog(STRING_CONSTANTS.INFO_BE_SET_UP_VIRTUAL_ENV);

    const installDepsCommandStr = `${COMMAND_CONSTANTS.CMD_PIPENV_INSTALL} ${installString}`;

    // execute install command
    await execaCommand(installDepsCommandStr);

    if (verboseLogs)
      ConsoleLogger.printLog(
        STRING_CONSTANTS.SUCCESS_BE_FINISHED_VIRTUAL_ENV,
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
 * @function copyWebTemplateFiles
 * @param projectPath
 * @param loggerMode
 * @description copies required web core template files to the project directory
 */
export async function copyWebTemplateFiles(
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
      PATH_CONSTANTS.PATH_WEB_APP_CORE_TEMPLATE
    );

    if (verboseLogs)
      ConsoleLogger.printLog(STRING_CONSTANTS.INFO_BE_COPY_CORE_FILES);

    await copy(coreAppFilesPath, projectPath, { recursive: true });

    if (verboseLogs)
      ConsoleLogger.printLog(
        STRING_CONSTANTS.SUCCESS_BE_COPY_CORE_FILES,
        'success'
      );

    // 3. copy base template files
    const baseTemplatePath = path.resolve(
      normalizedPath,
      PATH_CONSTANTS.PATH_WEB_BASE_TEMPLATE
    );

    const appTemplateDestPath = path.join(
      projectPath,
      PATH_CONSTANTS.DIR_NAME_TEMPLATES
    );

    if (verboseLogs)
      ConsoleLogger.printLog(STRING_CONSTANTS.INFO_BE_COPY_BASE_TEMPLATE);

    await copy(baseTemplatePath, appTemplateDestPath, { recursive: true });

    if (verboseLogs)
      ConsoleLogger.printLog(
        STRING_CONSTANTS.SUCCESS_BE_COPY_BASE_TEMPLATE,
        'success'
      );

    // 4. copy support files
    const supportFilesTemplatePath = path.resolve(
      normalizedPath,
      PATH_CONSTANTS.PATH_VITE_HMR_TAGS
    );

    const supportFilesDestPath = path.join(
      projectPath,
      PATH_CONSTANTS.DIR_NAME_SUPPORT
    );

    if (verboseLogs)
      ConsoleLogger.printLog(STRING_CONSTANTS.INFO_BE_COPY_SUPPORT_FILES);

    await copy(supportFilesTemplatePath, supportFilesDestPath, {
      recursive: true,
    });

    if (verboseLogs)
      ConsoleLogger.printLog(
        STRING_CONSTANTS.SUCCESS_BE_COPY_SUPPORT_FILES,
        'success'
      );

    // hand off to scaffold core function
    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}

/**
 * @async
 * @param {string} projectPath
 * @param {LoggerMode} loggerMode
 * @description Sets up the base vite dependencies
 * @return {Promise<ScaffoldOutput>}
 */
export async function setupBaseFrontend(
  projectPath: string,
  loggerMode: LoggerMode
): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  const verbose = loggerMode === 'verbose';
  try {
    if (verbose) ConsoleLogger.printLog('Installing base vite dependencies...');

    // 1. load and install dependencies
    const currentUrl = import.meta.url;

    const viteDepsFilePath = path.resolve(
      path.normalize(new URL(currentUrl).pathname),
      PATH_CONSTANTS.FILE_FRONTEND_CORE_DEPS
    );

    const viteDepsFile = await readFile(viteDepsFilePath, {
      encoding: 'utf-8',
    });

    const depsData = JSON.parse(viteDepsFile) as STRMPackageFile;

    const installString = Object.keys(depsData.packages)
      .map((dep: string) => `${dep}@${depsData.packages[dep]}`)
      .join(' ');

    const cmd = `${COMMAND_CONSTANTS.CMD_NPM_DEV_INSTALL} ${installString}`;

    // execute install
    await execaCommand(cmd);

    if (verbose)
      ConsoleLogger.printLog('Installed base vite dependencies!', 'success');

    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}

/**
 * @async
 * @param frontend
 * @param loggerMode
 * @returns {Promise<ScaffoldOutput>}
 * @description Runs the process to set up the frontend specified by frontend
 */
export async function setupFrontend(
  frontend: FrontendOpt,
  loggerMode: LoggerMode
): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  const verbose = loggerMode === 'verbose';

  try {
    // load frontend dependencies file
    const currentPath = import.meta.url;
    const frontendDepsPath = path.resolve(
      path.normalize(new URL(currentPath).pathname),
      PATH_CONSTANTS.FILE_FRONTEND_MAIN_DEPS
    );

    // 2. determine which fronted to install
    const frontendDepsFile = await readFile(frontendDepsPath, {
      encoding: 'utf-8',
    });

    const frontendDeps = JSON.parse(
      frontendDepsFile
    ) as FrontendDependenciesFile;

    const { common, frontendDeps: dependencies } = frontendDeps;
    const feDeps = dependencies[frontend];

    const commonInstallString = Object.keys(common)
      .map((dep) => `${dep}@${common[dep]}`)
      .join(' ');

    const feInstallString = Object.keys(feDeps)
      .map((dep) => `${dep}@${feDeps[dep]}`)
      .join(' ');

    const finalInstallString = `${COMMAND_CONSTANTS.CMD_NPM_DEV_INSTALL} ${commonInstallString} ${feInstallString}`;

    if (verbose)
      ConsoleLogger.printLog(
        `Installing dependencies for frontend: ${frontend}...`
      );

    await execaCommand(finalInstallString);

    if (verbose)
      ConsoleLogger.printLog(
        `Installed dependencies for frontend: ${frontend}`,
        'success'
      );

    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}

/**
 * @async
 * @param {string} projectPath
 * @param {FrontendOpt} frontend
 * @param {LoggerMode} loggerMode
 * @returns {Promise<ScaffoldOutput>}
 * @description Copies specific frontend files to the project destination
 */
export async function copyFrontendTemplates(
  projectPath: string,
  frontend: FrontendOpt,
  loggerMode: LoggerMode
): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  const verbose = loggerMode === 'verbose';
  try {
    // 1. find source directory to copy from
    const currentPath = import.meta.url;

    const frontendTemplatesPath = path.resolve(
      path.normalize(new URL(currentPath).pathname),
      PATH_CONSTANTS.PATH_FRONTEND_TEMPLATES,
      frontend
    );

    const targetPath = path.join(projectPath, `strm_fe_${frontend}`, 'src');

    if (verbose)
      ConsoleLogger.printLog(
        `Copying frontend template files for: ${frontend}`
      );

    // 2. copy files to destination
    await copy(frontendTemplatesPath, targetPath, { recursive: true });

    if (verbose)
      ConsoleLogger.printLog(`Copied frontend template files`, 'success');

    output.message = 'Frontend template files copied';
    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}

/**
 * @async
 * @function updateProjectConfiguration
 * @param {string} projectPath
 * @param {ScaffoldOpts} scaffoldOptions
 * @returns {Promise<ScaffoldOutput>}
 * @description Updates the project configuration file (strm_config.json) based on
 * options selected during the CLI prompting phase of the scaffold process.
 */
export async function updateProjectConfiguration(
  projectPath: string,
  scaffoldOptions: ScaffoldOpts
): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  const verbose = scaffoldOptions.loggerMode === 'verbose';
  try {
    if (verbose)
      ConsoleLogger.printLog('Preparing to update project configuration...');

    // 1. read config data
    const configData = await getProjectConfig(projectPath);

    if (!configData) {
      output.message = 'Unable to load project configuration';
      return output;
    }

    // read config file and then get the relevant config data
    const currentUrl = import.meta.url;
    const configPath = path.resolve(
      path.normalize(new URL(currentUrl).pathname),
      PATH_CONSTANTS.FILE_FRONTEND_CONFIGS
    );

    const data = await readFile(configPath, { encoding: 'utf-8' });
    const feConfigData = JSON.parse(data) as STRMFrontendOptFile;

    // 2. update configuration based scaffoldOpts
    configData.appId = scaffoldOptions.projectName;
    configData.frontend = scaffoldOptions.frontend;
    configData.frontendEntryPoint =
      feConfigData[scaffoldOptions.frontend].entryPoint;
    configData.frontendExtensions =
      feConfigData[scaffoldOptions.frontend].extensions;
    configData.frontendBasePath =
      feConfigData[scaffoldOptions.frontend].basePath;

    const configWriteResult = await writeProjectConfigData(
      path.join(projectPath, PATH_CONSTANTS.DIR_NAME_FE_CONFIG),
      PATH_CONSTANTS.FILE_FE_APP_CONFIG,
      JSON.stringify(configData, null, 2)
    );

    if (!configWriteResult.success) {
      output.message = configWriteResult.message;
      return output;
    }

    if (verbose)
      ConsoleLogger.printLog(
        STRING_CONSTANTS.SUCCESS_UPDATE_PROJECT_CONFIG,
        'success'
      );

    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}

/**
 * @async
 * @function
 * @param {string} projectPath
 * @param {ScaffoldOpts} scaffoldOptions
 * @returns {Promise<ScaffoldOutput>}
 * @description Update the project pkg file based on the scaffold options.
 */
export async function updateProjectPkgFile(
  projectPath: string,
  scaffoldOptions: ScaffoldOpts
): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  const verbose = scaffoldOptions.loggerMode === 'verbose';
  try {
    if (verbose)
      ConsoleLogger.printLog(STRING_CONSTANTS.INFO_UPDATE_PROJECT_PKG_FILE);

    // pkg file path
    const pkgFileData = await getProjectPkg(projectPath);

    if (!pkgFileData) {
      output.message = ERROR_CONSTANTS.ERR_PKG_FILE_LOAD_FAIL;
      return output;
    }

    // update the contents of the pkg file
    pkgFileData.name = scaffoldOptions.projectName;

    // write pkg file data
    const dataToWrite = JSON.stringify(pkgFileData, null, 2);
    const pkgWriteResult = await writeProjectConfigData(
      projectPath,
      PATH_CONSTANTS.FILE_PACKAGE_JSON,
      dataToWrite
    );

    if (!pkgWriteResult.success) {
      output.message = pkgWriteResult.message;
      return output;
    }

    if (verbose)
      ConsoleLogger.printLog(
        STRING_CONSTANTS.SUCCESS_UPDATE_PROJECT_PKG_FILE,
        'success'
      );

    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}
