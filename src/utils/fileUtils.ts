/**
 * @author SaiForceOne
 * @description A collection of utility functions specific to the filesystem
 */

import path from 'node:path';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { ConsoleLogger } from './consoleLogger.js';

import STORMConfigFile = STORMStackCLI.STORMConfigFile;
import ScaffoldOutput = STORMStackCLI.ScaffoldOutput;
import { buildScaffoldOutput } from './generalUtils.js';
import STORMProjectPkgFile = STORMStackCLI.STORMProjectPkgFile;
import { PATH_CONSTANTS } from '../constants/pathConstants.js';
import { LocaleManager } from '../cliHelpers/localeManager.js';
import { platform } from 'os';

/**
 * @async
 * @function destinationPathExists
 * @param {string} path - represents the destination the project should be generated in
 * @return Promise<boolean>
 */
export async function destinationPathExists(path: string): Promise<boolean> {
  try {
    const fileStats = await stat(path);
    return !!fileStats;
  } catch (e) {
    return false;
  }
}

/**
 * @deprecated
 * @param path
 */
export function isInProjectDir(path: string): boolean {
  return process.cwd() === path;
}

/**
 * @async
 * @function getProjectConfig
 * @param {string} projectRoot
 * @returns {Promise<STORMConfigFile|undefined>}
 * @description Helper function that reads the config file from disk and returns
 * a "typed" JSON object to make it easier to update the project config
 */
export async function getProjectConfig(
  projectRoot: string
): Promise<STORMConfigFile | undefined> {
  try {
    // 1. try to load config file
    let configFilePath = path.resolve(
      projectRoot,
      'storm_config',
      'storm_config.json'
    );

    if (platform() === 'win32')
      configFilePath = normalizeWinFilePath(configFilePath);

    const configFileData = await readFile(configFilePath, {
      encoding: 'utf-8',
    });
    return JSON.parse(configFileData) as STORMConfigFile;
  } catch (e) {
    ConsoleLogger.printLog(
      `Failed to read project with error: ${(e as Error).message}`
    );
  }
}

/**
 * @function getProjectPkgPath
 * @param {string} projectPath
 * @returns {string}
 * @description Returns the project package file path at destination
 */
export function getProjectPkgPath(projectPath: string): string {
  return path.resolve(projectPath, PATH_CONSTANTS.FILE_PACKAGE_JSON);
}

/**
 * @async
 * @function getProjectPkg
 * @param {string} projectPath the directory of the project (destination directory)
 * @returns {Promise<STORMProjectPkgFile|undefined>}
 * @description Helper function that reads the project's package.json file and returns
 * it as "typed" object or undefined if it fails
 */
export async function getProjectPkg(
  projectPath: string
): Promise<STORMProjectPkgFile | undefined> {
  try {
    let pkgFilePath = path.resolve(projectPath, 'package.json');
    if (platform() === 'win32') pkgFilePath = normalizeWinFilePath(pkgFilePath);
    const pkgFileData = await readFile(pkgFilePath, { encoding: 'utf-8' });
    return JSON.parse(pkgFileData) as STORMProjectPkgFile;
  } catch (e) {
    ConsoleLogger.printLog(
      `Failed to read project pkg file with error: ${(e as Error).message}`
    );
  }
}

/**
 *
 * @param {string} destinationRoot The root folder of the file to be over-written
 * @param {string} targetFile The name of the file to be written. ex: package.json
 * @param {string} data The data to be written to the target file. Typically,
 * this will be the result of JSON.stringify()
 */
export async function writeProjectConfigData(
  destinationRoot: string,
  targetFile: string,
  data: string
): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  try {
    let targetPath = path.resolve(destinationRoot, targetFile);
    if (platform() === 'win32') targetPath = normalizeWinFilePath(targetPath);

    await writeFile(targetPath, data);
    output.message =
      LocaleManager.getInstance().getLocaleData().frontend.success.UPDATE_PROJECT_CONFIG;
    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}

/**
 * @description Helper function that gets the root of the ST🌀RM CLI to make it
 * easier to construct paths when template and other files need to be copied to
 * the destination project
 * @returns {string}
 */
export function getSTORMCLIRoot(): string {
  const currentUrl = import.meta.url;
  let cliRoot = path.resolve(new URL(currentUrl).pathname, '../../../');
  if (platform() === 'win32') cliRoot = normalizeWinFilePath(cliRoot);
  return cliRoot;
}

/**
 * @description Helper function that fixes Windows file paths. Not needed for Posix
 * @param {string} filePath
 */
export function normalizeWinFilePath(filePath: string) {
  return filePath.replace(/^([A-Z]:\\)([A-Z]:\\)/i, '$2');
}
