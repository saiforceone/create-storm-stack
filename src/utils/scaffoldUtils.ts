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

// ST🌀RM STACK Imports
import ScaffoldOutput = STORMStackCLI.ScaffoldOutput;
import LoggerMode = STORMStackCLI.LoggerMode;
import STORMPackageFile = STORMStackCLI.STORMPackageFile;
import { buildScaffoldOutput } from './generalUtils.js';
import {
  destinationPathExists,
  getProjectConfig,
  getProjectPkg,
  normalizeWinFilePath,
  writeProjectConfigData,
} from './fileUtils.js';
import { ConsoleLogger } from './consoleLogger.js';
import { FILE_UTIL_CONSTANTS } from '../constants/fileUtilConstants.js';
import { PATH_CONSTANTS } from '../constants/pathConstants.js';
import { COMMAND_CONSTANTS } from '../constants/commandConstants.js';
import FrontendOpt = STORMStackCLI.FrontendOpt;
import FrontendDependenciesFile = STORMStackCLI.FrontendDependenciesFile;
import ScaffoldOpts = STORMStackCLI.ScaffoldOpts;
import STORMFrontendOptFile = STORMStackCLI.STORMFrontendOptFile;
import STORMProjectScript = STORMStackCLI.STORMProjectScript;

// Import the Locale manager so that localized strings will be used
import { LocaleManager } from '../cliHelpers/localeManager.js';
import { platform } from 'os';

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
    let targetPath = path.join(process.cwd(), projectName);
    if (platform() === 'win32') targetPath = normalizeWinFilePath(targetPath);

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

    let stormStackCoreDepsPath = path.resolve(
      path.normalize(new URL(currentUrl).pathname),
      PATH_CONSTANTS.FILE_WEB_APP_CORE_DEPS
    );

    if (platform() === 'win32')
      stormStackCoreDepsPath = normalizeWinFilePath(stormStackCoreDepsPath);

    // read the file contents
    const pkgFile = await readFile(stormStackCoreDepsPath, {
      encoding: 'utf-8',
    });
    const pkgData = JSON.parse(pkgFile) as STORMPackageFile;
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
    let coreAppFilesPath = path.resolve(
      normalizedPath,
      PATH_CONSTANTS.PATH_WEB_APP_CORE_TEMPLATE
    );

    if (platform() === 'win32')
      coreAppFilesPath = normalizeWinFilePath(coreAppFilesPath);

    if (verboseLogs)
      ConsoleLogger.printLog(LocaleData.backend.info.COPY_CORE_FILES);

    await copy(coreAppFilesPath, projectPath, { recursive: true });

    if (verboseLogs)
      ConsoleLogger.printLog(
        LocaleData.backend.success.COPY_CORE_FILES,
        'success'
      );

    // 3. copy base template files
    let baseTemplatePath = path.resolve(
      normalizedPath,
      PATH_CONSTANTS.PATH_WEB_BASE_TEMPLATE
    );

    if (platform() === 'win32')
      baseTemplatePath = normalizeWinFilePath(baseTemplatePath);

    let appTemplateDestPath = path.join(
      projectPath,
      PATH_CONSTANTS.DIR_NAME_TEMPLATES
    );

    if (platform() === 'win32')
      appTemplateDestPath = normalizeWinFilePath(appTemplateDestPath);

    if (verboseLogs)
      ConsoleLogger.printLog(LocaleData.backend.info.COPY_BASE_TEMPLATE);

    await copy(baseTemplatePath, appTemplateDestPath, { recursive: true });

    if (verboseLogs)
      ConsoleLogger.printLog(
        LocaleData.backend.success.COPY_BASE_TEMPLATE,
        'success'
      );

    // 4. copy support files
    let supportFilesTemplatePath = path.resolve(
      normalizedPath,
      PATH_CONSTANTS.PATH_STORM_SUPPORT_FILES
    );

    if (platform() === 'win32')
      supportFilesTemplatePath = normalizeWinFilePath(supportFilesTemplatePath);

    let supportFilesDestPath = path.join(
      projectPath,
      PATH_CONSTANTS.DIR_NAME_SUPPORT
    );

    if (platform() === 'win32')
      supportFilesDestPath = normalizeWinFilePath(supportFilesDestPath);

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

    let viteDepsFilePath = path.resolve(
      path.normalize(new URL(currentUrl).pathname),
      PATH_CONSTANTS.FILE_FRONTEND_CORE_DEPS
    );

    if (platform() === 'win32')
      viteDepsFilePath = normalizeWinFilePath(viteDepsFilePath);

    const viteDepsFile = await readFile(viteDepsFilePath, {
      encoding: 'utf-8',
    });

    const depsData = JSON.parse(viteDepsFile) as STORMPackageFile;

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
    let frontendDepsPath = path.resolve(
      path.normalize(new URL(currentPath).pathname),
      PATH_CONSTANTS.FILE_FRONTEND_MAIN_DEPS
    );

    if (platform() === 'win32')
      frontendDepsPath = normalizeWinFilePath(frontendDepsPath);

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

    let frontendTemplatesPath = path.resolve(
      path.normalize(new URL(currentPath).pathname),
      PATH_CONSTANTS.PATH_FRONTEND_TEMPLATES,
      frontend
    );

    if (platform() === 'win32')
      frontendTemplatesPath = normalizeWinFilePath(frontendTemplatesPath);

    let targetPath = path.join(projectPath, `storm_fe_${frontend}`, 'src');
    if (platform() === 'win32') targetPath = normalizeWinFilePath(targetPath);

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

    let feResourcesPath = path.resolve(
      path.normalize(new URL(currentURL).pathname),
      '../../../',
      'templates/STORMProjectResources',
      scaffoldOpts.frontend
    );

    if (platform() === 'win32')
      feResourcesPath = normalizeWinFilePath(feResourcesPath);

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
 * @description Updates the project configuration file (storm_config.json) based on
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
    let configPath = path.resolve(
      path.normalize(new URL(currentUrl).pathname),
      PATH_CONSTANTS.FILE_FRONTEND_CONFIGS
    );

    if (platform() === 'win32') configPath = normalizeWinFilePath(configPath);

    const data = await readFile(configPath, { encoding: 'utf-8' });
    const feConfigData = JSON.parse(data) as STORMFrontendOptFile;

    // 2. update configuration based scaffoldOpts
    configData.appId = scaffoldOptions.projectName;
    configData.frontend = scaffoldOptions.frontend;
    configData.frontendEntryPoint =
      feConfigData[scaffoldOptions.frontend].entryPoint;
    configData.frontendExtensions =
      feConfigData[scaffoldOptions.frontend].extensions;
    configData.frontendBasePath =
      feConfigData[scaffoldOptions.frontend].basePath;
    configData.codeQualityAddons = scaffoldOptions.stormCQAddons;
    configData.frontendAddons = scaffoldOptions.stormFEAddons;
    configData.backendAddons = scaffoldOptions.stormBEAddons;

    let configDestPath = path.join(
      projectPath,
      PATH_CONSTANTS.DIR_NAME_FE_CONFIG
    );
    if (platform() === 'win32')
      configDestPath = normalizeWinFilePath(configDestPath);

    const configWriteResult = await writeProjectConfigData(
      configDestPath,
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
    let envExamplePath = path.resolve(
      projectPath,
      PATH_CONSTANTS.FILE_ENV_EXAMPLE
    );

    if (platform() === 'win32')
      envExamplePath = normalizeWinFilePath(envExamplePath);

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
    parsedEnv[FILE_UTIL_CONSTANTS.ENV_KEY_SENTRY_DSN] = 'ADD-YOUR-SENTRY-DSN';

    // Write default database uri by itself
    parsedEnv[
      FILE_UTIL_CONSTANTS.ENV_KEY_DB_URI
    ] = `mongodb://127.0.0.1:27017/${scaffoldOpts.projectName}`;

    // write contents to the parsed environment object
    let envData = '';

    Object.keys(parsedEnv).forEach((key) => {
      envData += `${key}=${parsedEnv[key]}\n`;
    });

    let envDestination = path.join(projectPath, PATH_CONSTANTS.FILE_ENV);

    if (platform() === 'win32')
      envDestination = normalizeWinFilePath(envDestination);

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
    // rename _dist to dist at destination
    let oldDistPath = path.resolve(projectPath, 'static', '_dist');
    if (platform() === 'win32') oldDistPath = normalizeWinFilePath(oldDistPath);

    let distPath = path.join(projectPath, 'static', 'dist');
    if (platform() === 'win32') distPath = normalizeWinFilePath(distPath);

    await rename(oldDistPath, distPath);

    // rename .gitignore.template to .gitignore
    const ignoreTemplateFilePath = path.resolve(
      projectPath,
      '.gitignore.template'
    );

    let gitIgnorePath = path.join(projectPath, '.gitignore');
    if (platform() === 'win32')
      gitIgnorePath = normalizeWinFilePath(gitIgnorePath);

    await rename(ignoreTemplateFilePath, gitIgnorePath);

    output.message = 'Files renamed';
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
 * @param {Array<STORMProjectScript>} pkgScripts commands that should be written to package.json at the destination
 * @returns {Promise<ScaffoldOutput>}
 * @description utility function that writes commands to the scripts section of the package.json file at the destination
 * (scaffolded project)
 */
export async function writeScriptUpdates(
  projectPath: string,
  pkgScripts: Array<STORMProjectScript>
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

/**
 * @function enableGit
 * @param {LoggerMode} loggerMode
 * @description runs the command to enable git
 * @returns {Promise<ScaffoldOutput>}
 */
export async function enableGit(
  loggerMode: LoggerMode
): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  const verbose = loggerMode === 'verbose';
  const LocaleData = LocaleManager.getInstance().getLocaleData();
  try {
    if (verbose)
      ConsoleLogger.printLog(`${LocaleData.backend.info.ENABLE_GIT}`);
    await execaCommand(COMMAND_CONSTANTS.CMD_GIT_INIT);
    if (verbose)
      ConsoleLogger.printLog(
        `${LocaleData.backend.success.ENABLE_GIT}`,
        'success'
      );
    output.message = LocaleData.backend.success.ENABLE_GIT;
    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    if (verbose)
      ConsoleLogger.printLog(`${LocaleData.backend.error.ENABLE_GIT}`, 'error');
    return output;
  }
}

/**
 * @function getFrontendEntrypoint
 * @description Helper function that gets the frontend entry point
 * @param {FrontendOpt} frontend
 * @returns {string}
 */
export function getFrontendEntrypoint(frontend: FrontendOpt): string {
  const entrypoints: Record<FrontendOpt, string> = {
    react: 'main.tsx',
    vue: 'main.ts'
  };

  return `storm_fe_${frontend}/src/${entrypoints[frontend]}`;
}
