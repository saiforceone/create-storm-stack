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
import ScaffoldOpts = FTLStackCLI.ScaffoldOpts;
import { scaffoldCore } from './scaffoldFuncs/scaffoldCore.js';

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

  const cliAnswers = (await cliPrompts()) as ScaffoldOpts;

  // 1. Scaffold backend / core
  const coreSetupResult = await scaffoldCore(cliAnswers);

  console.log(coreSetupResult);

  postScaffold();
}
