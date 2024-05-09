/**
 * @author SaiForceOne
 * @description A collection of helper functions specific to the CLI
 */
// Core & third-party imports
import * as Constants from 'constants';
import { execaCommand } from 'execa';
import ora from 'ora';
import path from 'node:path';
import {
  access,
  appendFile,
  mkdir,
  readFile,
  writeFile,
} from 'node:fs/promises';
import { platform } from 'os';

// ST🌀RM Stack imports
import { ConsoleLogger } from './consoleLogger.js';
import {
  getProjectConfig,
  getSTORMCLIRoot,
  normalizeWinFilePath,
} from './fileUtils.js';
import { LocaleManager } from '../cliHelpers/localeManager.js';
import { buildScaffoldOutput, titleCase } from './generalUtils.js';
import STORMProjectPkgFile = STORMStackCLI.STORMProjectPkgFile;
import STORMLocaleData = STORMStackCLI.STORMLocaleData;
import ScaffoldOutput = STORMStackCLI.ScaffoldOutput;
import STORMConfigFile = STORMStackCLI.STORMConfigFile;
import STORMModuleArgs = STORMStackCLI.STORMModuleArgs;
import STORMModulesFile = STORMStackCLI.STORMModulesFile;
import STORMModule = STORMStackCLI.STORMModule;
import STORMController = STORMStackCLI.STORMController;
import STORMFERoute = STORMStackCLI.STORMFERoute;
import { generateIndexPage } from '../cliHelpers/fePageHelpers/generateIndexPage.js';
import generateDetailsPage from '../cliHelpers/fePageHelpers/generateDetailsPage.js';
import STORMCommandExecStatus = STORMStackCLI.STORMCommandExecStatus;
import FrontendOpt = STORMStackCLI.FrontendOpt;

const STORM_MODULES_PATH = 'storm_modules/storm_modules.json';
// Semantic Version pattern for dependencies
const SEMVER_PATTERN = /\d+.\d+.\d+/g;

const FRONTEND_COMPONENT_EXT: Record<FrontendOpt, string> = {
  react: 'tsx',
  vue: 'vue',
};

/**
 * @async
 * @description Reads the CLI's package.json file and returns the version or not if it fails
 * @returns {Promise<string|undefined>}
 */
export async function getCLIVersion(): Promise<string | undefined> {
  try {
    const currentUrl = import.meta.url;
    let pkgPath = path.resolve(
      path.normalize(new URL(currentUrl).pathname),
      '../../../',
      'package.json'
    );

    if (platform() === 'win32') pkgPath = normalizeWinFilePath(pkgPath);

    const pkgData = await readFile(pkgPath, {
      encoding: 'utf-8',
    });

    const parsedPkg = JSON.parse(pkgData) as STORMProjectPkgFile;

    return parsedPkg.version;
  } catch (e) {
    ConsoleLogger.printLog(`${e.message}`, 'error');
  }
}

/**
 * @function loadLocaleFile
 * @param {string} locale
 * @description Given a locale, attempts to read the corresponding locale file
 * and load the contents into the LocaleManager (singleton)
 */
export async function loadLocaleFile(locale: string) {
  try {
    const cliRoot = getSTORMCLIRoot();
    let localeFilePath = path.resolve(cliRoot, `locales/${locale}.json`);
    if (platform() === 'win32')
      localeFilePath = normalizeWinFilePath(localeFilePath);
    const localeFileData = await readFile(localeFilePath, {
      encoding: 'utf-8',
    });
    const localeData = JSON.parse(localeFileData) as STORMLocaleData;
    LocaleManager.getInstance().setLocaleData(localeData);
    LocaleManager.getInstance().setLocale(locale);
  } catch (e) {
    ConsoleLogger.printLog(`Failed to load locale file error: ${e.toString()}`);
    process.exit(1);
  }
}

/**
 * @async
 * @function checkSTORMProject
 * @param {string} projectDir the directory to be checked
 * @param {boolean} showOutput determines if the output should be shown
 * @description Checks that the target directory contains a ST🌀RM Stack Project
 * @returns {Promise<ScaffoldOutput>}
 */
export async function checkSTORMProject(
  projectDir: string,
  showOutput: boolean = false
): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();

  try {
    // read the JSON config file
    let configPath = path.resolve(
      projectDir,
      'storm_config',
      'storm_config.json'
    );

    if (platform() === 'win32') configPath = normalizeWinFilePath(configPath);

    const configData = await readFile(configPath, { encoding: 'utf-8' });
    const parsedConfig = JSON.parse(configData) as STORMConfigFile;

    // check if project has the appropriate files and folders
    const frontendDir = `storm_fe_${parsedConfig.frontend}`;
    const PATHS = [
      frontendDir,
      `${frontendDir}/src/${parsedConfig.frontendEntryPoint}`,
      `${frontendDir}/src/pages`,
      'storm_controllers',
      'storm_models',
      'storm_dto',
      STORM_MODULES_PATH,
      'storm_routes',
      'support/storm_hmr.py',
      'templates/app.html',
      'app.py',
      'vite.config.ts',
      'tailwind.config.ts',
    ];
    // loop over paths and check for read access
    for (const dir of PATHS) {
      await access(path.resolve(projectDir, dir), Constants.R_OK);
      if (showOutput) console.log('✔️ ', dir);
    }

    output.success = true;
    return output;
  } catch (e) {
    output.message = e.message;
    return output;
  }
}

/**
 * @async
 * @function writeSTORMControllerFile
 * @description Attempts to create a controller file based on the given name.
 * @param {string} controllerName the name of the controller
 * @returns {Promise<ScaffoldOutput>} an object indicating result
 */
async function writeSTORMControllerFile(
  controllerName: string
): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  const localeData = LocaleManager.getInstance().getLocaleData();
  try {
    const controllerData = `# Generated by the ${
      localeData.misc.STORM_BRANDED
    } ${new Date().toLocaleDateString()}
# Core imports
from starlette.endpoints import HTTPEndpoint
from starlette.responses import JSONResponse


class ${titleCase(controllerName)}Controller(HTTPEndpoint):
\t"""
\tAutogenerated: Represents a ${localeData.misc.STORM_BRANDED} Controller
\t"""
\tdef get(self, request):
\t\treturn JSONResponse({
\t\t\t"success": True,
\t\t\t"message": "Controller generated by the CLI. Edit 'storm_models/${controllerName}.py as needed"
\t\t})\n
`;

    const controllerFilePath = path.resolve(
      process.cwd(),
      `storm_controllers/${controllerName}_controller.py`
    );
    // write output
    await writeFile(controllerFilePath, controllerData);
    output.success = true;
    return output;
  } catch (e) {
    output.message = e.message;
    return output;
  }
}

/**
 * @async
 * @function updateSTORMModuleRouteAutoImports
 * @description given a controller name, updates the auto imports (storm_controllers/__init__.py)
 * @param {string} controllerName
 * @returns {Promise<ScaffoldOutput>} an object indicating the result of the operation
 */
async function updateSTORMModuleRouteAutoImports(
  controllerName: string
): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  try {
    let autoImportPath = path.resolve(
      process.cwd(),
      `storm_controllers/__init__.py`
    );

    if (platform() === 'win32')
      autoImportPath = normalizeWinFilePath(autoImportPath);
    // append to the file
    const autoImportData = `from .${controllerName}_controller import ${titleCase(
      controllerName
    )}Controller\n`;
    await appendFile(autoImportPath, autoImportData);
    output.success = true;
    return output;
  } catch (e) {
    output.message = e.message;
    return output;
  }
}

/**
 * @function writeSTORMModelFile
 * @description given a model name, attempts to create the model file
 * @param {string} modelName the name of the model
 * @returns {Promise<ScaffoldOutput>}
 */
async function writeSTORMModelFile(modelName: string): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  try {
    const localeData = LocaleManager.getInstance().getLocaleData();
    // build model file
    const modelFileData = `# Generated by the ${
      localeData.misc.STORM_BRANDED
    } ${new Date().toLocaleDateString()}
# Core Imports
import datetime
import mongoengine as me
from _base import StormModel


class ${titleCase(modelName)}(StormModel):
\t"""
\tAutogenerated:
\tRepresents a ${modelName}
\t"""
\tlabel = me.StringField(required=True, max_length=200)
    `;
    const modelFilePath = path.resolve(
      process.cwd(),
      `storm_models/${modelName}.py`
    );
    await writeFile(modelFilePath, modelFileData);
    output.success = true;
    return output;
  } catch (e) {
    output.message = e.message;
    return output;
  }
}

/**
 * @functon writeSTORMDTOFile
 * @param {string} modelName the name of the model that the DTO is related to
 * @returns {Promise<ScaffoldOutput>} object containing information about the result of the operation
 */
async function writeSTORMDTOFile(modelName: string): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  try {
    const localeData = LocaleManager.getInstance().getLocaleData();
    const dtoFileData = `# Generated by the ${
      localeData.misc.STORM_BRANDED
    } ${new Date().toLocaleDateString()}
# Core Imports
from pydantic import BaseModel


class ${titleCase(modelName)}DTO(BaseModel):
\t"""
\tGenerated by create-storm-stack
\tRepresents a DTO that can be used for validating incoming data based on model: ${modelName}
\t
\t📝 Developer Note: You will want to import the typing library for things like optional as well
\tas adding the fields required. The DTO goes along with the 'validate_with_dto' wrapper function
\tused in controllers.
\t"""
\tlabel: str

`;
    const dtoPath = path.resolve(
      process.cwd(),
      `storm_dto/${modelName}_dto.py`
    );
    await writeFile(dtoPath, dtoFileData);
    output.success = true;
    return output;
  } catch (e) {
    output.message = e.message;
    return output;
  }
}

/**
 * @async
 * @function getSTORMModules
 * @description Helper function that attempts to read the storm_modules.json file and returns a typed object or not
 * @returns {Promise<STORMModulesFile|undefined>}
 */
async function getSTORMModules(): Promise<STORMModulesFile | undefined> {
  try {
    let modulesFilePath = path.resolve(process.cwd(), STORM_MODULES_PATH);
    if (platform() === 'win32')
      modulesFilePath = normalizeWinFilePath(modulesFilePath);
    const modulesFileStringData = await readFile(modulesFilePath, {
      encoding: 'utf-8',
    });
    return JSON.parse(modulesFileStringData) as STORMModulesFile;
  } catch (e) {
    return;
  }
}

/**
 * @function writeSTORMModulesFile
 * @description Given STORMModulesFile data, attempts to write to the filesystem
 * @param {STORMModulesFile} stormModulesFile the STORMModules files data that should be written to the filesystem
 * @returns {Promise<ScaffoldOutput>}
 */
async function writeSTORMModulesFile(
  stormModulesFile: STORMModulesFile
): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  try {
    let targetPath = path.resolve(process.cwd(), STORM_MODULES_PATH);
    if (platform() === 'win32') targetPath = normalizeWinFilePath(targetPath);
    stormModulesFile.lastUpdated = new Date().toISOString();
    const dataToWrite = JSON.stringify(stormModulesFile, undefined, 2);
    await writeFile(targetPath, dataToWrite);

    output.success = true;
    return output;
  } catch (e) {
    output.message = e.message;
    return output;
  }
}

/**
 * @function regenerateSTORMModuleRoutes
 * @description Attempts to rewrite the backend routes (storm_routes/__init__.py) based on the contents of the modules file (storm_modules/storm_modules.json)
 * @returns {Promise<ScaffoldOutput>} an object indicating the result of operation
 */
async function regenerateSTORMModuleRoutes(): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  const localeData = LocaleManager.getInstance().getLocaleData();
  try {
    // read storm_modules
    const modulesJSON = await getSTORMModules();

    if (!modulesJSON) {
      output.message = localeData.advCli.error.LOAD_STORM_MODULES;
      return output;
    }

    let controllerRoutesString = ``;
    // extract the controllers from modules
    Object.keys(modulesJSON['modules']).forEach((moduleKey, index) => {
      const module = modulesJSON['modules'][moduleKey];
      if (module) {
        const { controller } = module;
        const correctedControllerName = controller.controllerName
          .split('_')
          .map((word) => {
            return `${String(word).charAt(0).toUpperCase()}${String(word).slice(
              1
            )}`;
          })
          .join('');
        const shouldAddNewLine =
          index !== Object.keys(modulesJSON['modules']).length - 1;
        controllerRoutesString += `        Route('/${controller.endpointBase}', ${correctedControllerName}),\n`;
        controllerRoutesString += `        Route('/${
          controller.endpointBase
        }/{${moduleKey}}', ${correctedControllerName}),${
          shouldAddNewLine ? '\n' : ''
        }`;
      }
    });

    const routesString = `# Generated by the ${
      localeData.misc.STORM_BRANDED
    } ${new Date().toLocaleDateString()}
# core imports
from starlette.routing import Mount, Route
# ${localeData.misc.STORM_BRANDED} imports
from storm_controllers import *


# generated routes
routes = [
    Mount('/api', routes=[
${controllerRoutesString}
    ])
]
`;
    // write to file replacing contents
    let targetFilePath = path.resolve(
      process.cwd(),
      'storm_routes/__init__.py'
    );

    if (platform() === 'win32')
      targetFilePath = normalizeWinFilePath(targetFilePath);

    await writeFile(targetFilePath, routesString);

    output.success = true;
    return output;
  } catch (e) {
    output.message = e.message;
    return output;
  }
}

/**
 * @function buildSTORMFrontendComponents
 * @description Given an array of STORMFERoute objects read from the modules file
 * (storm_modules/storm_modules.json), reads the config file and generates the
 * frontend component based on the frontend option specified in the config
 * (storm_config/storm_config.json) file and the given pluralizedModuleName.
 * @param {string} moduleKey
 * @param {string} pluralizedModuleName
 * @returns {Promise<ScaffoldOutput>} an object indicating the result of the operation
 */
async function buildSTORMFrontendComponents(
  moduleKey: string,
  pluralizedModuleName: string
): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  const localeData = LocaleManager.getInstance().getLocaleData();
  try {
    // read our storm config
    const stormConfig = await getProjectConfig(process.cwd());
    if (!stormConfig) {
      output.message = localeData.advCli.error.LOAD_STORM_CONFIG;
      return output;
    }
    // read storm modules
    const stormModules = await getSTORMModules();
    if (!stormModules) {
      output.message = localeData.advCli.error.LOAD_STORM_MODULES;
      return output;
    }

    const feFolder = `storm_fe_${stormConfig.frontend}`;
    let feBasePath = path.resolve(
      process.cwd(),
      feFolder,
      'src/pages',
      titleCase(pluralizedModuleName)
    );

    if (platform() === 'win32') feBasePath = normalizeWinFilePath(feBasePath);

    // create folder
    await mkdir(feBasePath);

    // loop over pages and build components as needed
    const module = stormModules.modules[moduleKey];
    if (!module) {
      output.message = localeData.advCli.responses.INVALID_STORM_MODULE;
      return output;
    }

    const { pages } = module;
    const componentExt = FRONTEND_COMPONENT_EXT[stormConfig.frontend];
    for (const page of pages) {
      // attempt to generate page components
      const isIndexPage = page.componentPath.includes('Index');
      const fileName = isIndexPage
        ? `Index.${componentExt}`
        : `${page.componentName}.${componentExt}`;
      const pageData = isIndexPage
        ? generateIndexPage(
            stormConfig.frontend,
            page.componentName,
            page.componentPath,
            module.controller
          )
        : generateDetailsPage(
            stormConfig.frontend,
            page.componentName,
            page.componentPath,
            module.controller
          );
      let pageFilePath = path.resolve(feBasePath, fileName);
      if (platform() === 'win32')
        pageFilePath = normalizeWinFilePath(pageFilePath);
      await writeFile(pageFilePath, pageData);
      ConsoleLogger.printCLIProcessSuccessMessage({
        message: localeData.advCli.success.CREATE_FE_COMPONENT,
        detail: pageFilePath,
      });
    }

    output.success = true;
    return output;
  } catch (e) {
    output.message = e.message;
    return output;
  }
}

/**
 * @function buildSTORMModule
 * @description Helper function that constructs a ST🌀RM module based on the given parameters
 * @param {STORMModuleArgs} moduleArgs command line arguments passed in
 * @returns {STORMModule} an object representing a module
 */
function buildSTORMModule(moduleArgs: STORMModuleArgs): STORMModule {
  const { name, controllerOnly, plural } = moduleArgs;

  const pluralizedName = plural ? plural : name;
  const lowercaseName = name.toLowerCase();
  // setup controller
  const controller: STORMController = {
    controllerName: `${lowercaseName}_controller`,
    modelName: `${lowercaseName}.py`,
    endpointBase: pluralizedName,
  };

  const pages: Array<STORMFERoute> = [];

  // setup pages (if controllerOnly = false)
  if (!controllerOnly) {
    const indexPage: STORMFERoute = {
      path: `/${pluralizedName}`,
      componentName: titleCase(name),
      componentPath: `${titleCase(pluralizedName)}/Index`,
    };

    const detailsPage: STORMFERoute = {
      path: `/${pluralizedName}/:id`,
      componentName: `${titleCase(name)}Detail`,
      componentPath: `${titleCase(pluralizedName)}/${titleCase(name)}Detail`,
    };

    pages.push(indexPage, detailsPage);
  }

  return {
    controller,
    controllerOnly: !!controllerOnly,
    pages,
  };
}

/**
 * @async
 * @function createSTORMModule
 * @description Utility function that handles the creation of a ST🌀RM Stack Module
 * @param {STORMModuleArgs} moduleArgs
 * @returns {Promise<ScaffoldOutput>} Standard scaffold output indicating the result of attempting to create a module
 */
export async function createSTORMModule(
  moduleArgs: STORMModuleArgs
): Promise<ScaffoldOutput> {
  const localeData = LocaleManager.getInstance().getLocaleData();
  const output = buildScaffoldOutput();
  try {
    const { name } = moduleArgs;
    ConsoleLogger.printCLIProcessInfoMessage(
      localeData.advCli.info.LOAD_STORM_MODULES,
      STORM_MODULES_PATH
    );
    // 0. read configuration
    const stormModulesFileData = await getSTORMModules();
    if (!stormModulesFileData) {
      ConsoleLogger.printCLIProcessErrorMessage(
        localeData.advCli.error.LOAD_STORM_MODULES,
        STORM_MODULES_PATH
      );
      output.message = localeData.advCli.error.LOAD_STORM_MODULES;
      return output;
    }

    ConsoleLogger.printCLIProcessSuccessMessage({
      message: localeData.advCli.success.LOAD_STORM_MODULES,
      detail: STORM_MODULES_PATH,
    });

    // check existing module
    if (stormModulesFileData.modules[name]) {
      output.message = localeData.advCli.responses.MODULE_ALREADY_EXISTS;
      return output;
    }

    // 0.1 update modules JSON file
    stormModulesFileData.modules[name] = buildSTORMModule(moduleArgs);
    ConsoleLogger.printCLIProcessInfoMessage(
      localeData.advCli.info.WRITE_STORM_MODULES
    );
    const writeModulesResult =
      await writeSTORMModulesFile(stormModulesFileData);
    if (!writeModulesResult.success) {
      output.message = localeData.advCli.error.WRITE_STORM_MODULES;
      ConsoleLogger.printCLIProcessErrorMessage(
        localeData.advCli.error.WRITE_STORM_MODULES
      );
      return output;
    }
    ConsoleLogger.printCLIProcessSuccessMessage({
      message: localeData.advCli.success.WRITE_STORM_MODULES,
    });
    // 1. build model

    ConsoleLogger.printCLIProcessInfoMessage(
      localeData.advCli.info.CREATE_MODEL,
      `storm_models/${name.toLowerCase()}.py`
    );
    const modelResult = await writeSTORMModelFile(name);
    if (!modelResult.success) {
      output.message = modelResult.message;
      ConsoleLogger.printCLIProcessErrorMessage(
        localeData.advCli.error.CREATE_MODEL
      );
      return output;
    }
    ConsoleLogger.printCLIProcessSuccessMessage({
      message: localeData.advCli.success.CREATE_MODEL,
      detail: `storm_models/${name.toLowerCase()}.py`,
    });
    // 2. build controller
    ConsoleLogger.printCLIProcessInfoMessage(
      localeData.advCli.info.CREATE_CONTROLLER,
      `storm_controllers/${name}_controller.py`
    );
    const controllerResult = await writeSTORMControllerFile(name);
    if (!controllerResult.success) {
      output.message = controllerResult.message;
      ConsoleLogger.printCLIProcessErrorMessage(
        localeData.advCli.error.CREATE_CONTROLLER
      );
      return output;
    }
    ConsoleLogger.printCLIProcessSuccessMessage({
      message: localeData.advCli.success.CREATE_CONTROLLER,
      detail: `storm_controllers/${name.toLowerCase()}_controller.py`,
    });
    // 2.5 build the DTO file
    ConsoleLogger.printCLIProcessInfoMessage(
      localeData.advCli.info.CREATE_DTO,
      `storm_dto/${name.toLowerCase()}_dto.py`
    );
    const dtoResult = await writeSTORMDTOFile(name);
    if (!dtoResult.success) {
      output.message = dtoResult.message;
      ConsoleLogger.printCLIProcessErrorMessage(
        localeData.advCli.error.CREATE_DTO
      );
      return output;
    }
    ConsoleLogger.printCLIProcessSuccessMessage({
      message: localeData.advCli.success.CREATE_DTO,
    });
    // 3. rewrite backend routes
    ConsoleLogger.printCLIProcessInfoMessage(
      localeData.advCli.info.REWRITE_MODULE_ROUTES,
      'storm_routes/__init__.py'
    );

    const moduleRoutesResult = await regenerateSTORMModuleRoutes();

    if (!moduleRoutesResult.success) {
      output.message = moduleRoutesResult.message;
      ConsoleLogger.printCLIProcessErrorMessage(
        localeData.advCli.error.REWRITE_MODULE_ROUTES,
        'storm_routes/__init__.py file'
      );
      return output;
    }

    ConsoleLogger.printCLIProcessSuccessMessage({
      message: localeData.advCli.success.REWRITE_MODULE_ROUTES,
    });

    // 3.1 update auto imports
    ConsoleLogger.printCLIProcessInfoMessage(
      localeData.advCli.info.UPDATE_AUTO_IMPORTS,
      'storm_controllers/__init__.py'
    );
    const updateAutoImportsResult =
      await updateSTORMModuleRouteAutoImports(name);
    if (!updateAutoImportsResult.success) {
      output.message = updateAutoImportsResult.message;
      ConsoleLogger.printCLIProcessErrorMessage(
        localeData.advCli.error.UPDATE_AUTO_IMPORTS,
        updateAutoImportsResult.message
      );
      return output;
    }

    ConsoleLogger.printCLIProcessSuccessMessage({
      message: localeData.advCli.success.UPDATE_AUTO_IMPORTS,
    });

    // 4. build frontend components
    ConsoleLogger.printCLIProcessInfoMessage(
      localeData.advCli.info.BUILD_FRONTEND_COMPONENTS
    );
    const buildFEComponentsResult = await buildSTORMFrontendComponents(
      name,
      moduleArgs.plural ? moduleArgs.plural : name
    );

    if (!buildFEComponentsResult.success) {
      output.message = buildFEComponentsResult.message;
      ConsoleLogger.printCLIProcessErrorMessage(
        localeData.advCli.error.BUILD_FRONTEND_COMPONENTS,
        buildFEComponentsResult.message
      );
      return output;
    }

    ConsoleLogger.printCLIProcessSuccessMessage({
      message: localeData.advCli.success.BUILD_FRONTEND_COMPONENTS,
    });

    output.success = true;
    return output;
  } catch (e) {
    output.message = e.message;
    return output;
  }
}

/**
 * @function checkPythonVersion
 * @description Helper function that checks the version of Python installed on the
 * current system and returns appropriate messaging
 * @returns {Promise<STORMCommandExecStatus>}
 */
async function checkPythonVersion(): Promise<STORMCommandExecStatus> {
  // define python command string based on the target OS
  let command;
  const targetPlatform = platform();
  switch (targetPlatform) {
    case 'win32':
      command = 'py -V';
      break;
    case 'linux':
      command = 'python3 -V';
      break;
    default:
      command = 'python3 -V';
  }
  // python command exec test
  const pythonCmdStatus: STORMCommandExecStatus = {
    label: 'Python',
    success: false,
    command,
    details:
      'Python was not found on your system. Please install before trying to use the STORM Stack CLI',
    required: true,
  };
  try {
    const { stdout: pyStdout } = await execaCommand(pythonCmdStatus.command);
    // check the version returned
    const pyVersionString = pyStdout.match(SEMVER_PATTERN);
    if (!pyVersionString || !pyVersionString.length) {
      pythonCmdStatus.details = 'Python was not found on your system';
    } else {
      // check the version by splitting the string since it was matched via Regex
      const [pyMajorVersion, pyMinorVersion] = pyVersionString[0].split('.');
      if (+pyMajorVersion! >= 3 && +pyMinorVersion! >= 8) {
        pythonCmdStatus.success = true;
        pythonCmdStatus.details = `${pyStdout}`;
      }
    }
  } catch (e) {
    pythonCmdStatus.details = e.message;
  }

  return pythonCmdStatus;
}

/**
 * @async
 * @function checkPipenvVersion
 * @description Helper function that checks to make sure that pipenv is installed
 * and returns the appropriate messaging based on the result.
 * @returns {Promise<STORMCommandExecStatus>} an object representing the result
 */
async function checkPipenvVersion(): Promise<STORMCommandExecStatus> {
  const pipenvStatus: STORMCommandExecStatus = {
    label: 'Pipenv',
    success: false,
    command: 'pipenv --version',
    details: 'Command not found',
    required: true,
  };

  try {
    const { stdout } = await execaCommand(pipenvStatus.command);
    if (stdout.includes('pipenv')) {
      pipenvStatus.success = true;
      pipenvStatus.details = stdout;
    }
  } catch (e) {
    pipenvStatus.details = e.message;
  }

  return pipenvStatus;
}

/**
 * @function checkNodeVersion
 * @description Helper function that checks to make sure that the version of Node
 * installed meets the minimum requirements of >= 16.7.0.
 * @returns {Promise<STORMCommandExecStatus} an object representing the result
 */
async function checkNodeVersion(): Promise<STORMCommandExecStatus> {
  const nodeStatus: STORMCommandExecStatus = {
    label: 'NodeJs',
    success: false,
    command: 'node -v',
    details: 'command not found',
    required: true,
  };

  try {
    const { stdout } = await execaCommand(nodeStatus.command);
    const nodeSemver = stdout.match(SEMVER_PATTERN);

    if (!nodeSemver || !nodeSemver.length) {
      nodeStatus.details = 'Something went wrong';
    } else {
      const [nodeMajorVersion, nodeMinorVersion] = nodeSemver[0].split('.');
      if (
        (+nodeMajorVersion! >= 16 && +nodeMinorVersion! >= 7) ||
        +nodeMajorVersion! > 17
      ) {
        nodeStatus.success = true;
        nodeStatus.details = `NodeJS ${stdout}`;
      }
    }
  } catch (e) {
    nodeStatus.details = e.message;
  }

  return nodeStatus;
}

/**
 * @function checkGitVersion
 * @description Helper function that checks for the optional requirement of git being installed.
 * @returns {Promise<STORMCommandExecStatus>}
 */
async function checkGitVersion(): Promise<STORMCommandExecStatus> {
  const gitStatus: STORMCommandExecStatus = {
    label: 'Git',
    success: false,
    command: 'git --version',
    details: 'command unavailable',
    required: false,
  };

  try {
    const { stdout } = await execaCommand(gitStatus.command);
    gitStatus.success = true;
    gitStatus.details = `${stdout}`;
  } catch (e) {
    gitStatus.details = e.message;
  }

  return gitStatus;
}

/**
 * @async
 * @function preScaffoldCommandExecCheck
 * @param {boolean} printOutput
 * @description when run, this function checks to make sure that the system-level
 * dependencies are installed so that the CLI can function properly. In the event
 * that a required dependency is not installed (ex. pipenv), the appropriate messaging
 * should be output to the console
 * @returns {Promise<ScaffoldOutput>} standard scaffold output object
 */
export async function preScaffoldCommandExecCheck(
  printOutput: boolean
): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  const commandList: Array<STORMCommandExecStatus> = [];

  // check versions by calling helper functions and then pushing result to command list
  commandList.push(await checkPythonVersion());
  commandList.push(await checkPipenvVersion());
  commandList.push(await checkNodeVersion());
  commandList.push(await checkGitVersion());

  for (const cmdStatus of commandList) {
    const requiredText = cmdStatus.required ? 'required' : 'optional';
    if (!cmdStatus.success && !printOutput)
      if (cmdStatus.required)
        ConsoleLogger.printCLIProcessErrorMessage(
          `${cmdStatus.label} (${requiredText})`,
          cmdStatus.details
        );
    if (printOutput) {
      cmdStatus.success
        ? ConsoleLogger.printCLIProcessSuccessMessage({
            message: `${cmdStatus.label} (${requiredText})`,
            detail: cmdStatus.details,
          })
        : cmdStatus.required
        ? ConsoleLogger.printCLIProcessErrorMessage(
            `${cmdStatus.label} (${requiredText})`,
            cmdStatus.details
          )
        : ConsoleLogger.printCLIProcessWarningMessage({
            message: `${cmdStatus.label} (${requiredText})`,
            detail: cmdStatus.details,
          });
    }
  }

  const hasFailed = commandList.some(
    (element) => !element.success && element.required
  );

  output.success = !hasFailed;
  return output;
}

/**
 * @function execDependencyChecks
 * @description Helper function that performs dependency checks for the CLI and
 * in the event that dependencies are not met, exits the CLI
 */
export async function execDependencyChecks(): Promise<void> {
  /**
   * To ensure a smooth CLI experience, the minimum versions of dependencies need
   * to be checked. Visual feedback will be provided to the user via a spinner
   */
  const dependencyCheckSpinner = ora(
    'Checking ST🌀RM Stack core dependencies...'
  ).start();

  const dependencyCheckResult = await preScaffoldCommandExecCheck(false);

  if (!dependencyCheckResult.success) {
    dependencyCheckSpinner.fail();
    process.exit(1);
  }

  dependencyCheckSpinner.succeed('Starting ST🌀RM Stack CLI');
}
