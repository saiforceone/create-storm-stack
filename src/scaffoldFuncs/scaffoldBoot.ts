/**
 * @author SaiForceOne
 * @description Perform pre-scaffold tasks for example, locale detection and
 * prompting
 */
// Core & third-party imports
import path from 'node:path';
import inquirer, { Answers, QuestionCollection } from 'inquirer';
import { readFile } from 'node:fs/promises';

// STRM-Stack Imports
import { getSTRMCLIRoot } from '../utils/fileUtils.js';
import { LocaleManager } from '../cliHelpers/localeManager.js';
import STRMLocaleData = STRMStackCLI.STRMLocaleData;
import STRMBootOpts = STRMStackCLI.STRMBootOpts;
import { ConsoleLogger } from '../utils/consoleLogger.js';

/**
 * @function setupScaffoldBootPrompts
 * @param {string} defaultLocale
 * @returns {QuestionCollection} Returns a collection of questions
 * @description Given a default locale, returns a collection of questions that will
 * be used to prompt the user during the boot process of the STORM CLI
 */
function setupScaffoldBootPrompts(defaultLocale: string): QuestionCollection {
  return [
    {
      name: 'locale',
      message: 'Language',
      type: 'list',
      choices: ['en', 'es'],
      default: defaultLocale,
    },
  ];
}

/**
 * @function scaffoldBootPrompts
 * @param {string} defaultLocale the locale obtained from the system during scaffold boot
 * @returns {Promise<Answers>} Returns an object containing answers to the CLI prompts
 * @description Given a default locale as a string, prompts the user for
 * answers at scaffold boot and then returns the object containing answers
 */
async function scaffoldBootPrompts(defaultLocale: string): Promise<Answers> {
  return inquirer.prompt(setupScaffoldBootPrompts(defaultLocale));
}

/**
 * @function loadLocaleFile
 * @param {string} locale
 * @description Given a locale, attempts to read the corresponding locale file
 * and load the contents into the LocaleManager (singleton)
 */
async function loadLocaleFile(locale: string) {
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
 * @function scaffoldBoot
 * @description Performs pre-scaffold checks and other related tasks. This
 * function should run before any other scaffold functions execute
 */
export async function scaffoldBoot(): Promise<void> {
  // locale detection
  let localeString = new Intl.NumberFormat().resolvedOptions().locale;

  const localeParts = localeString.split('-');

  if (localeParts.length > 1) {
    localeString = localeParts[0]!;
  }
  // prompt for locale selection
  const setupAnswers = (await scaffoldBootPrompts(
    localeString
  )) as STRMBootOpts;

  // load appropriate locale JSON file
  await loadLocaleFile(setupAnswers.locale);
}
