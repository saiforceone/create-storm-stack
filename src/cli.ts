/**
 * @author SaiForceOne
 * @description Standard CLI
 */
// Core & Third-party import
import inquirer from 'inquirer';
import type { Answers } from 'inquirer';

// STRM Stack Imports
import { preScaffold } from './cliHelpers/preScaffold.js';
import { printScaffoldSummary } from './cliHelpers/postScaffold.js';
import { INQUIRER_PROMPTS } from './cliHelpers/inquirerPrompts.js';
import ScaffoldOpts = STRMStackCLI.ScaffoldOpts;
import { scaffoldCore } from './scaffoldFuncs/scaffoldCore.js';
import { scaffoldFrontend } from './scaffoldFuncs/scaffoldFrontend.js';
import { scaffoldPost } from './scaffoldFuncs/scaffoldPost.js';
import { ConsoleLogger } from './utils/consoleLogger.js';

/**
 * @async
 * @function cliPrompts
 * @description returns the answers from CLI prompts
 */
async function cliPrompts(): Promise<Answers> {
  return inquirer.prompt(INQUIRER_PROMPTS);
}

/**
 * @description Performs the steps to scaffold the project step by step by calling
 * the necessary helper / scaffolding functions.
 */
export async function cli(): Promise<void> {
  preScaffold();

  const cliAnswers = (await cliPrompts()) as ScaffoldOpts;

  // 1. Scaffold backend / core
  const coreSetupResult = await scaffoldCore(cliAnswers);

  if (!coreSetupResult.success) {
    ConsoleLogger.printLog(
      `Scaffold process failed with error: ${coreSetupResult.message}`,
      'error'
    );
    return;
  }

  // 2. Scaffold frontend
  const frontendSetupResult = await scaffoldFrontend(cliAnswers);

  if (!frontendSetupResult.success) {
    ConsoleLogger.printLog(
      `Scaffold process failed with error: ${frontendSetupResult.message}`,
      'error'
    );
    return;
  }

  // 3. Post Scaffold
  const postScaffoldResult = await scaffoldPost(cliAnswers);

  if (!postScaffoldResult.success) {
    ConsoleLogger.printLog(
      `Scaffold process failed with error: ${postScaffoldResult.message}`,
      'error'
    );
    return;
  }

  // Print post scaffold messaging
  printScaffoldSummary(cliAnswers);
}
