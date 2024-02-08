/**
 * @uathor SaiForceOne
 * @description Inquirer-specific prompts for the CLI
 */

// Core & Third-party Imports
import type { QuestionCollection } from 'inquirer';

// ST🌀RM Stack Imports
import { validateProjectOrModuleName } from '../utils/generalUtils.js';
import { LocaleManager } from './localeManager.js';
import inquirer from "inquirer";

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
      message: localeData.cli.prompts.PROJECT_NAME,
      name: 'projectName',
      type: 'input',
      validate: function (input: string) {
        return validateProjectOrModuleName(input)
          ? true
          : localeData.cli.PROJECT_DIR_INVALID;
      },
    },
    // Frontend option prompt
    {
      message: localeData.cli.prompts.FRONTEND_CHOICE,
      name: 'frontend',
      type: 'list',
      choices: ['react', 'vue'],
    },
    // Optional ST🌀RM Code Quality add-ons
    {
      message: localeData.cli.prompts.INSTALL_CODE_QUALITY_ADDON,
      name: 'stormCQAddons',
      type: 'checkbox',
      choices: [
        {
          name: 'Prettier (code style)',
          value: 'prettier',
        },
      ]
    },
    // Optional ST🌀RM Frontend addons
    {
      message: localeData.cli.prompts.INSTALL_FRONTEND_ADDON,
      name: 'stormFEAddons',
      type: 'checkbox',
      choices: [
        {
          name: 'Sentry (FE Logging)',
          value: 'sentry',
        }
      ],
    },
    // Optional ST🌀RM Backend addons
    {
      message: localeData.cli.prompts.INSTALL_BACKEND_ADDON,
      name: 'stormBEAddons',
      type: 'checkbox',
      choices: [
        {
          name: 'Sentry (BE Logging)',
          value: 'sentry'
        }
      ]
    },
    {
      message: `${localeData.cli.prompts.ENABLE_OPTION}: Git`,
      name: 'enableGit',
      type: 'confirm',
      default: false,
    },
    // ConsoleLogger Type
    {
      message: localeData.cli.prompts.LOGGING_MODE,
      name: 'loggerMode',
      type: 'list',
      choices: ['quiet', 'verbose'],
    },
  ];
}
