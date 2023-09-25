/**
 * @author SaiForceOne
 * @description Standard CLI
 */
// Core & Third-party import
import inquirer from 'inquirer';
import type { Answers } from 'inquirer';

// FTL Stack Imports
import { preScaffold } from './cliHelpers/preScaffold.js';
import { postScaffold } from './cliHelpers/postScaffold.js';
import { INQUIRER_PROMPTS } from './cliHelpers/inquirerPrompts.js';
import { ConsoleLogger } from './utils/consoleLogger.js';

/**
 * @async
 * @function cliPrompts
 * @description returns the answers from CLI prompts
 */
async function cliPrompts(): Promise<Answers> {
  return inquirer.prompt(INQUIRER_PROMPTS);
}

export async function cli() {
  preScaffold();

  const cliAnswers = await cliPrompts();

  // Process answers
  console.log(cliAnswers);

  ConsoleLogger.printLog('This is an info log test');
  ConsoleLogger.printLog('This is an warning log test', 'warning');
  ConsoleLogger.printLog('This is an success log test', 'success');
  ConsoleLogger.printLog('This is an error log test', 'error');

  postScaffold();
}
