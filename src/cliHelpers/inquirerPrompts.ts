/**
 * @uathor SaiForceOne
 * @description Inquirer-specific prompts for the CLI
 */

// Core & Third-party Imports
import type { QuestionCollection } from 'inquirer';

// STRM Stack Imports
import { validateProjectName } from '../utils/generalUtils.js';
import { LocaleManager } from './localeManager.js';

/**
 * @function getCLIPrompts
 * @returns {QuestionCollection} A collection of localized prompts to the user
 * @description Returns the CLI Prompts with localized prompts / questions
 */
export function getCLIPrompts(): QuestionCollection {
  const localeData = LocaleManager.getInstance().getLocaleData();
  return [
    // project name prompt
    {
      message: localeData.cli.PROMPT_PROJECT_NAME,
      name: 'projectName',
      type: 'input',
      validate: function (input: string) {
        return validateProjectName(input)
          ? true
          : localeData.cli.PROJECT_DIR_INVALID;
      },
    },
    // Frontend option prompt
    {
      message: localeData.cli.PROMPT_FRONTEND_CHOICE,
      name: 'frontend',
      type: 'list',
      choices: ['react', 'lit', 'vue'],
    },
    // STRM Add Ons
    {
      message: 'Install Prettier (optional add-on)',
      name: 'installPrettier',
      type: 'confirm',
      default: false,
    },
    // ConsoleLogger Type
    {
      message: 'What kind of logging should we use',
      name: 'loggerMode',
      type: 'list',
      choices: ['quiet', 'verbose'],
    },
  ];
}
