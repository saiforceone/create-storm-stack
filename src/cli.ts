/**
 * @author SaiForceOne
 * @description Standard CLI
 */
// Core & Third-party import
import inquirer from 'inquirer';
import type { Answers } from 'inquirer';

// STRM Stack Imports
import { printPreScaffoldMessage } from './cliHelpers/printPreScaffoldMessage.js';
import { printScaffoldSummary } from './cliHelpers/postScaffold.js';
import { getCLIPrompts } from './cliHelpers/inquirerPrompts.js';
import ScaffoldOpts = STRMStackCLI.ScaffoldOpts;
import { execCLIInstallation } from './cliHelpers/installationHelpers.js';
import { scaffoldBoot } from './scaffoldFuncs/scaffoldBoot.js';

/**
 * @async
 * @function cliPrompts
 * @description returns the answers from CLI prompts
 */
async function cliPrompts(): Promise<Answers> {
  return inquirer.prompt(getCLIPrompts());
}

/**
 * @description Performs the steps to scaffold the project step by step by calling
 * the necessary helper / scaffolding functions.
 */
export async function cli(): Promise<void> {
  await scaffoldBoot();

  printPreScaffoldMessage();

  const cliAnswers = (await cliPrompts()) as ScaffoldOpts;

  // Execute CLI installation with options
  await execCLIInstallation(cliAnswers)();

  // Print post scaffold messaging
  printScaffoldSummary(cliAnswers);
}
