/**
 * @uathor SaiForceOne
 * @description Inquirer-specific prompts for the CLI
 */

// Core & Third-party Imports
import type { QuestionCollection } from 'inquirer';

// FTL Stack Imports
import { validateProjectName } from '../utils/generalUtils.js';

export const INQUIRER_PROMPTS: QuestionCollection = [
  // project name prompt
  {
    message: 'What should we call this project',
    name: 'projectName',
    type: 'input',
    validate: function (input: string) {
      return validateProjectName(input) ? true : 'Project name is not valid';
    },
  },
  // Frontend option prompt
  // ConsoleLogger Type
  {
    message: 'What kind of logging should we use',
    name: 'loggerMode',
    type: 'list',
    choices: ['quiet', 'verbose'],
  },
];
