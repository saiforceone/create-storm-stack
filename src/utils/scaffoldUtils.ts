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
  rename,
  writeFile,
} from 'node:fs/promises';
import { execaCommand } from 'execa';
import { parse } from 'dotenv';

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
import { ConsoleLogger } from './consoleLogger.js';
import { FILE_UTIL_CONSTANTS } from '../constants/fileUtilConstants.js';
import { PATH_CONSTANTS } from '../constants/pathConstants.js';
import { COMMAND_CONSTANTS } from '../constants/commandConstants.js';
import FrontendOpt = STRMStackCLI.FrontendOpt;
import FrontendDependenciesFile = STRMStackCLI.FrontendDependenciesFile;
import ScaffoldOpts = STRMStackCLI.ScaffoldOpts;
import STRMFrontendOptFile = STRMStackCLI.STRMFrontendOptFile;
import STRMProjectScript = STRMStackCLI.STRMProjectScript;

// Import the Locale manager so that localized strings will be used
import { LocaleManager } from '../cliHelpers/localeManager.js';

/**
 * @function setupProjectDir
 * @param {string} projectName
 * @description Sets up the project destination directory
 */
export async function setupProjectDir(
  projectName: string
): Promise<ScaffoldOutput> {
  const LocaleData = LocaleManager.getInstance().getLocaleData();
  const output = buildScaffoldOutput();
  try {
    // 0. check that the destination does not already exist
    const targetPath = path.join(process.cwd(), projectName);

    // 1. check the destination
    if (await destinationPathExists(targetPath)) {
      output.message = LocaleData.backend.error.PROJECT_DEST;
      // exit
      return output;
    }

    // 2. make target directory
    await mkdir(targetPath);

    // 3. check destination access
    await access(targetPath, constants.W_OK);

    output.message = LocaleData.backend.success.PROJECT_DEST;
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
  const LocaleData = LocaleManager.getInstance().getLocaleData();
  const output = buildScaffoldOutput();
  const verboseLogs = loggerMode === 'verbose';
  try {
    if (verboseLogs)
      ConsoleLogger.printLog(
        `${LocaleData.cli.info.CHANGE_DIR}: ${projectPath}`
      );

    // 1. cd / navigate to project path
    process.chdir(projectPath);

    // 2. execute command to create environment
    if (verboseLogs)
      ConsoleLogger.printLog(LocaleData.backend.info.SET_UP_VIRTUAL_ENV);

    // 3. load flask dependencies and install them
    const currentUrl = import.meta.url;

    const strmStackCoreDepsPath = path.resolve(
      path.normalize(new URL(currentUrl).pathname),
      PATH_CONSTANTS.FILE_WEB_APP_CORE_DEPS
    );

    // read the file contents
    const pkgFile = await readFile(strmStackCoreDepsPath, {
      encoding: 'utf-8',
    });
    const pkgData = JSON.parse(pkgFile) as STRMPackageFile;
    const { packages } = pkgData;

    // construct install string for dependencies
    const installString = Object.keys(packages)
      .map((pkg) => pkg)
      .join(' ');

    const installDepsCommandStr = `${COMMAND_CONSTANTS.CMD_PIPENV_INSTALL} ${installString}`;

    // execute install command
    await execaCommand(installDepsCommandStr);

    if (verboseLogs)
      ConsoleLogger.printLog(
        LocaleData.backend.success.FINISHED_VIRTUAL_ENV,
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
  const LocaleData = LocaleManager.getInstance().getLocaleData();
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
      ConsoleLogger.printLog(LocaleData.backend.info.COPY_CORE_FILES);

    await copy(coreAppFilesPath, projectPath, { recursive: true });

    if (verboseLogs)
      ConsoleLogger.printLog(
        LocaleData.backend.success.COPY_CORE_FILES,
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
      ConsoleLogger.printLog(LocaleData.backend.info.COPY_BASE_TEMPLATE);

    await copy(baseTemplatePath, appTemplateDestPath, { recursive: true });

    if (verboseLogs)
      ConsoleLogger.printLog(
        LocaleData.backend.success.COPY_BASE_TEMPLATE,
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
      ConsoleLogger.printLog(LocaleData.backend.info.COPY_SUPPORT_FILES);

    await copy(supportFilesTemplatePath, supportFilesDestPath, {
      recursive: true,
    });

    if (verboseLogs)
      ConsoleLogger.printLog(
        LocaleData.backend.success.COPY_SUPPORT_FILES,
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
  const LocaleData = LocaleManager.getInstance().getLocaleData();
  const output = buildScaffoldOutput();
  const verbose = loggerMode === 'verbose';
  try {
    if (verbose)
      ConsoleLogger.printLog(LocaleData.frontend.info.INSTALL_BASE_VITE_DEPS);

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
      ConsoleLogger.printLog(
        LocaleData.frontend.success.INSTALL_BASE_VITE_DEPS,
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
 * @param frontend
 * @param loggerMode
 * @returns {Promise<ScaffoldOutput>}
 * @description Runs the process to set up the frontend specified by frontend
 */
export async function setupFrontend(
  frontend: FrontendOpt,
  loggerMode: LoggerMode
): Promise<ScaffoldOutput> {
  const LocaleData = LocaleManager.getInstance().getLocaleData();
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
        `${LocaleData.frontend.info.INSTALL_FE_DEPS}: ${frontend}...`
      );

    await execaCommand(finalInstallString);

    if (verbose)
      ConsoleLogger.printLog(
        `${LocaleData.frontend.success.INSTALL_FE_DEPS}: ${frontend}`,
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
  const LocaleData = LocaleManager.getInstance().getLocaleData();
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
        `${LocaleData.frontend.info.COPY_FE_TEMPLATES}: (${frontend})`
      );

    // 2. copy files to destination
    await copy(frontendTemplatesPath, targetPath, { recursive: true });

    if (verbose)
      ConsoleLogger.printLog(
        `${LocaleData.frontend.success.COPY_FE_TEMPLATES}: (${frontend})`,
        'success'
      );

    output.message = LocaleData.frontend.success.COPY_FE_TEMPLATES;
    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}

/**
 * @param {string} projectPath
 * @param {ScaffoldOpts} scaffoldOpts
 * @returns {Promise<ScaffoldOutput>}
 * @description Copies frontend-specific resources to the destination
 */
export async function copyFrontendResources(
  projectPath: string,
  scaffoldOpts: ScaffoldOpts
): Promise<ScaffoldOutput> {
  const LocaleData = LocaleManager.getInstance().getLocaleData();
  const output = buildScaffoldOutput();
  const verbose = scaffoldOpts.loggerMode === 'verbose';
  try {
    if (verbose)
      ConsoleLogger.printLog(LocaleData.frontend.info.COPY_FE_RESOURCES);
    // 1. get path to frontend resources
    const currentURL = import.meta.url;

    const feResourcesPath = path.resolve(
      path.normalize(new URL(currentURL).pathname),
      '../../../',
      'templates/STRMProjectResources',
      scaffoldOpts.frontend
    );

    // 2. copy all the files
    await copy(feResourcesPath, projectPath, { recursive: true });

    if (verbose)
      ConsoleLogger.printLog(
        LocaleData.frontend.success.COPY_FE_RESOURCES,
        'success'
      );

    output.message = LocaleData.frontend.success.COPY_FE_RESOURCES;
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
  const LocaleData = LocaleManager.getInstance().getLocaleData();
  const output = buildScaffoldOutput();
  const verbose = scaffoldOptions.loggerMode === 'verbose';
  try {
    if (verbose)
      ConsoleLogger.printLog(LocaleData.frontend.info.UPDATE_PROJECT_CONFIG);

    // 1. read config data
    const configData = await getProjectConfig(projectPath);

    if (!configData) {
      output.message = LocaleData.frontend.error.UPDATE_PROJECT_CONFIG;
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
        LocaleData.frontend.success.UPDATE_PROJECT_CONFIG,
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
  const LocaleData = LocaleManager.getInstance().getLocaleData();
  const output = buildScaffoldOutput();
  const verbose = scaffoldOptions.loggerMode === 'verbose';
  try {
    if (verbose)
      ConsoleLogger.printLog(LocaleData.frontend.info.UPDATE_PROJECT_PKG_FILE);

    // pkg file path
    const pkgFileData = await getProjectPkg(projectPath);

    if (!pkgFileData) {
      output.message = LocaleData.frontend.error.UPDATE_PROJECT_PKG_FILE;
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
        LocaleData.frontend.success.UPDATE_PROJECT_PKG_FILE,
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
 * @param {string} projectPath
 * @param {ScaffoldOpts} scaffoldOpts
 * @description Creates the initial .env file based on .env.example and writes
 * the necessary data based on the config options
 */
export async function buildInitialEnvAtDest(
  projectPath: string,
  scaffoldOpts: ScaffoldOpts
): Promise<ScaffoldOutput> {
  const LocaleData = LocaleManager.getInstance().getLocaleData();
  const output = buildScaffoldOutput();
  const verbose = scaffoldOpts.loggerMode === 'verbose';
  try {
    if (verbose) ConsoleLogger.printLog(LocaleData.cli.info.WRITE_ENV_DATA);
    const envExamplePath = path.resolve(
      projectPath,
      PATH_CONSTANTS.FILE_ENV_EXAMPLE
    );

    const projectConfig = await getProjectConfig(projectPath);

    if (!projectConfig) {
      output.message = LocaleData.cli.error.LOAD_CONFIG_FILE;
      return output;
    }

    const parsedEnv = parse(await readFile(envExamplePath));
    // overwrite contents of parsedEnv from loaded project config
    parsedEnv[FILE_UTIL_CONSTANTS.ENV_KEY_APP_ID] = projectConfig.appId;
    parsedEnv[FILE_UTIL_CONSTANTS.ENV_KEY_FE] = projectConfig.frontend;
    parsedEnv[FILE_UTIL_CONSTANTS.ENV_KEY_FE_BASE_PATH] =
      projectConfig.frontendBasePath;
    parsedEnv[FILE_UTIL_CONSTANTS.ENV_KEY_FE_ENTRYPOINT] =
      projectConfig.frontendEntryPoint;
    parsedEnv[FILE_UTIL_CONSTANTS.ENV_KEY_FE_EXT] =
      projectConfig.frontendExtensions.join(',');
    parsedEnv[FILE_UTIL_CONSTANTS.ENV_KEY_VITE_HOST] = projectConfig.viteHost;
    parsedEnv[FILE_UTIL_CONSTANTS.ENV_KEY_VITE_PORT] = String(
      projectConfig.vitePort
    );

    // Write default database uri by itself
    parsedEnv[
      FILE_UTIL_CONSTANTS.ENV_KEY_DB_URI
    ] = `mongodb://127.0.0.1:27017/${scaffoldOpts.projectName}`;

    // write contents to the parsed environment object
    let envData = '';

    Object.keys(parsedEnv).forEach((key) => {
      envData += `${key}=${parsedEnv[key]}\n`;
    });

    const envDestination = path.join(projectPath, PATH_CONSTANTS.FILE_ENV);

    // write to destination
    await writeFile(envDestination, envData);

    if (verbose)
      ConsoleLogger.printLog(LocaleData.cli.success.WRITE_ENV_DATA, 'success');

    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}

/**
 * @param {string} projectPath
 * @returns {Promise<ScaffoldOutput>}
 * @description Renames files as needed at the destination
 */
export async function renameFilesAtDest(
  projectPath: string
): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();

  try {
    // rename .gitignore.template to .gitignore
    const ignoreTemplateFilePath = path.resolve(
      projectPath,
      '.gitignore.template'
    );

    const gitIgnorePath = path.join(projectPath, '.gitignore');

    await rename(ignoreTemplateFilePath, gitIgnorePath);

    output.message = 'File renamed';
    output.success = true;
    return output;
  } catch (e) {
    return output;
  }
}

/**
 * @async
 * @function writeScriptUpdates
 * @param {string} projectPath path of the project being scaffolded
 * @param {Array<STRMProjectScript>} pkgScripts commands that should be written to package.json at the destination
 * @returns {Promise<ScaffoldOutput>}
 * @description utility function that writes commands to the scripts section of the package.json file at the destination
 * (scaffolded project)
 */
export async function writeScriptUpdates(
  projectPath: string,
  pkgScripts: Array<STRMProjectScript>
): Promise<ScaffoldOutput> {
  const LocaleData = LocaleManager.getInstance().getLocaleData();
  const output = buildScaffoldOutput();
  try {
    const pkgAtDest = await getProjectPkg(projectPath);

    if (!pkgAtDest) {
      output.message = LocaleData.frontend.error.UPDATE_PKG_SCRIPTS;
      return output;
    }

    pkgScripts.forEach((pkgScript) => {
      pkgAtDest.scripts[pkgScript.name] = pkgScript.command;
    });

    const { message: writeMessage, success: writeSuccess } =
      await writeProjectConfigData(
        projectPath,
        PATH_CONSTANTS.FILE_PACKAGE_JSON,
        JSON.stringify(pkgAtDest, null, 2)
      );

    output.message = writeMessage;

    if (!writeSuccess) {
      output.message = LocaleData.frontend.error.UPDATE_PKG_SCRIPTS;
      return output;
    }

    output.message = LocaleData.frontend.success.UPDATE_PKG_SCRIPTS;
    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}
