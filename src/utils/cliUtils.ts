/**
 * @author SaiForceOne
 * @description A collection of helper functions specific to the CLI
 */
// Core & third-party imports
import path from 'node:path';
import { readFile } from 'node:fs/promises';

// STRM Stack imports
import { ConsoleLogger } from './consoleLogger.js';
import STRMProjectPkgFile = STRMStackCLI.STRMProjectPkgFile;
import { getSTRMCLIRoot } from './fileUtils.js';
import { LocaleManager } from '../cliHelpers/localeManager.js';
import STRMLocaleData = STRMStackCLI.STRMLocaleData;

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
