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
import {
  destinationPathExists,
  getProjectConfig,
  getProjectPkg,
  writeProjectConfigData,
} from './fileUtils.js';
import {
  ERR_PKG_FILE_LOAD_FAIL,
  ERR_PROJECT_DEST_EXISTS,
} from '../constants/errorConstants.js';
import { ConsoleLogger } from './consoleLogger.js';
import {
  FOLDER_NAME_SUPPORT,
  FOLDER_NAME_TEMPLATES,
  FTL_APP_CORE_TEMPLATE_PATH,
  FTL_BASE_TEMPLATE_PATH,
  FTL_CONFIG_FILE,
  FTL_CONFIG_PATH,
  FTL_FLASK_CORE_DEPS_FILE,
  FTL_FRONTEND_CONFIGS_FILE,
  FTL_FRONTEND_CORE_DEPS_FILE,
  FTL_FRONTEND_MAIN_DEPS_FILE,
  FTL_FRONTEND_TEMPLATES_PATH,
  FTL_PACKAGE_FILE,
  FTL_VITE_TAGS_PATH,
} from '../constants/pathConstants.js';
import {
  CMD_NPM_DEV_INSTALL,
  CMD_PIPENV_INSTALL,
} from '../constants/commandConstants.js';
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
  INFO_UPDATE_PROJECT_PKG_FILE,
  SUCCESS_UPDATE_PROJECT_PKG_FILE,
  SUCCESS_UPDATE_PROJECT_CONFIG,
} from '../constants/stringConstants.js';
import FrontendOpt = FTLStackCLI.FrontendOpt;
import FrontendDependenciesFile = FTLStackCLI.FrontendDependenciesFile;
import ScaffoldOpts = FTLStackCLI.ScaffoldOpts;
import FTLFrontendOptFile = FTLStackCLI.FTLFrontendOptFile;

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
      FTL_FRONTEND_CORE_DEPS_FILE
    );

    const viteDepsFile = await readFile(viteDepsFilePath, {
      encoding: 'utf-8',
    });

    const depsData = JSON.parse(viteDepsFile) as FTLPackageFile;

    const installString = Object.keys(depsData.packages)
      .map((dep: string) => `${dep}@${depsData.packages[dep]}`)
      .join(' ');

    const cmd = `${CMD_NPM_DEV_INSTALL} ${installString}`;

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
      FTL_FRONTEND_MAIN_DEPS_FILE
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

    const finalInstallString = `${CMD_NPM_DEV_INSTALL} ${commonInstallString} ${feInstallString}`;

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
      FTL_FRONTEND_TEMPLATES_PATH,
      frontend
    );

    const targetPath = path.join(projectPath, `ftl_fe_${frontend}`, 'src');

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
 * @description Updates the project configuration file (ftl_config.json) based on
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
      FTL_FRONTEND_CONFIGS_FILE
    );

    const data = await readFile(configPath, { encoding: 'utf-8' });
    const feConfigData = JSON.parse(data) as FTLFrontendOptFile;

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
      path.join(projectPath, FTL_CONFIG_PATH),
      FTL_CONFIG_FILE,
      JSON.stringify(configData, null, 2)
    );

    if (!configWriteResult.success) {
      output.message = configWriteResult.message;
      return output;
    }

    if (verbose)
      ConsoleLogger.printLog(SUCCESS_UPDATE_PROJECT_CONFIG, 'success');

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
    if (verbose) ConsoleLogger.printLog(INFO_UPDATE_PROJECT_PKG_FILE);

    // pkg file path
    const pkgFileData = await getProjectPkg(projectPath);

    if (!pkgFileData) {
      output.message = ERR_PKG_FILE_LOAD_FAIL;
      return output;
    }

    // update the contents of the pkg file
    pkgFileData.name = scaffoldOptions.projectName;

    // write pkg file data
    const dataToWrite = JSON.stringify(pkgFileData, null, 2);
    const pkgWriteResult = await writeProjectConfigData(
      projectPath,
      FTL_PACKAGE_FILE,
      dataToWrite
    );

    if (!pkgWriteResult.success) {
      output.message = pkgWriteResult.message;
      return output;
    }

    if (verbose)
      ConsoleLogger.printLog(SUCCESS_UPDATE_PROJECT_PKG_FILE, 'success');

    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}
