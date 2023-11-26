/**
 * @author SaiForceOne
 * @description A collection of helper functions specific to the CLI
 */
// Core & third-party imports
import * as Constants from 'constants';
import path from 'node:path';
import { readFile, access } from 'node:fs/promises';

// STRM Stack imports
import { ConsoleLogger } from './consoleLogger.js';
import STRMProjectPkgFile = STRMStackCLI.STRMProjectPkgFile;
import { getSTRMCLIRoot } from './fileUtils.js';
import { LocaleManager } from '../cliHelpers/localeManager.js';
import STRMLocaleData = STRMStackCLI.STRMLocaleData;
import ScaffoldOutput = STRMStackCLI.ScaffoldOutput;
import STRMConfigFile = STRMStackCLI.STRMConfigFile;
import FrontendOpt = STRMStackCLI.FrontendOpt;
import { buildScaffoldOutput } from './generalUtils.js';

/**
 * @async
 * @description Reads the CLI's package.json file and returns the version or not if it fails
 * @returns {Promise<string|undefined>}
 */
export async function getCLIVersion(): Promise<string | undefined> {
  try {
    const currentUrl = import.meta.url;
    const pkgPath = path.resolve(
      path.normalize(new URL(currentUrl).pathname),
      '../../../',
      'package.json'
    );

    const pkgData = await readFile(pkgPath, {
      encoding: 'utf-8',
    });

    const parsedPkg = JSON.parse(pkgData) as STRMProjectPkgFile;

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
    const cliRoot = getSTRMCLIRoot();
    const localeFilePath = path.resolve(cliRoot, `locales/${locale}.json`);
    const localeFileData = await readFile(localeFilePath, {
      encoding: 'utf-8',
    });
    const localeData = JSON.parse(localeFileData) as STRMLocaleData;
    LocaleManager.getInstance().setLocaleData(localeData);
    LocaleManager.getInstance().setLocale(locale);
  } catch (e) {
    ConsoleLogger.printLog(`Failed to load locale file error: ${e.toString()}`);
    process.exit(1);
  }
}

/**
 * @description helper function that validates the STRM config file to make sure correct information is present
 * @param strmConfig
 * @returns {Boolean}
 */
function validateSTRMConfig(strmConfig: STRMConfigFile): boolean {
  const errors = [];
  if (strmConfig.frontend) return false;
  return false;
}

/**
 * @async
 * @function checkSTRMProject
 * @param {string} projectDir the directory to be checked
 * @param {boolean} showOutput determines if the output should be shown
 * @description Checks that the target directory contains a STRM Stack Project
 * @returns {Promise<ScaffoldOutput>}
 */
export async function checkSTRMProject(
  projectDir: string,
  showOutput: boolean = false
): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();

  try {
    // read the JSON config file
    const configPath = path.resolve(
      projectDir,
      'strm_config',
      'strm_config.json'
    );

    const configData = await readFile(configPath, { encoding: 'utf-8' });
    const parsedConfig = JSON.parse(configData) as STRMConfigFile;

    // check if project has the appropriate files and folders
    const frontendDir = `strm_fe_${parsedConfig.frontend}`;
    const PATHS = [
      frontendDir,
      `${frontendDir}/src/${parsedConfig.frontendEntryPoint}`,
      `${frontendDir}/src/pages`,
      'strm_controllers',
      'strm_models',
      'strm_routes',
      'support/strm_hmr.py',
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
