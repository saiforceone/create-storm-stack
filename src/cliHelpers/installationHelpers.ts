/**
 * @author SaiForceOne
 * @description Contains helper functions specific to the CLI scaffold installation
 * process.
 */
// Core & third-party imports
import chalk from 'chalk';
import ora from 'ora';

// STORM Stack Imports
import ScaffoldOpts = STRMStackCLI.ScaffoldOpts;
import { STRING_CONSTANTS } from '../constants/stringConstants.js';
import { scaffoldCore } from '../scaffoldFuncs/scaffoldCore.js';
import { ConsoleLogger } from '../utils/consoleLogger.js';
import { scaffoldFrontend } from '../scaffoldFuncs/scaffoldFrontend.js';
import { scaffoldPost } from '../scaffoldFuncs/scaffoldPost.js';
import {
  buildAddOns,
  installScaffoldAddOns,
  scaffoldAddOns,
} from '../scaffoldFuncs/scaffoldAddOns.js';

/**
 * @function execCLIInstallation
 * @param {ScaffoldOpts} cliAnswers contains the prompts from the user
 * @description Helper function that get the installation options based on the
 * CLI logger mode selected
 */
export function execCLIInstallation(cliAnswers: ScaffoldOpts) {
  const cliInstallOpts: Record<STRMStackCLI.LoggerMode, () => Promise<void>> = {
    // handles quiet-mode installation
    quiet: async function (): Promise<void> {
      // set up ora spinners
      console.log('\n');
      const coreSetupSpinner = ora(
        `Installing ${STRING_CONSTANTS.STORM_BRANDED} stack core...`
      ).start();
      const { message: coreMessage, success: coreSuccess } =
        await scaffoldCore(cliAnswers);
      if (!coreSuccess) {
        coreSetupSpinner.fail(coreMessage);
        ConsoleLogger.printLog(`Error: ${coreMessage}`, 'error');
        process.exit(1);
      }
      coreSetupSpinner.succeed();

      const feSetupSpinner = ora(
        `Installing ${
          STRING_CONSTANTS.STORM_BRANDED
        } stack frontend (${chalk.bold(cliAnswers.frontend)})...`
      ).start();
      const { message: feMessage, success: feSuccess } =
        await scaffoldFrontend(cliAnswers);
      if (!feSuccess) {
        feSetupSpinner.fail(feMessage);
        ConsoleLogger.printLog(`Error:" ${feMessage}`, 'error');
        process.exit(1);
      }
      feSetupSpinner.succeed();

      if (cliAnswers.installPrettier) {
        const prettierSpinner = ora(
          `Installing ${STRING_CONSTANTS.STORM_BRANDED} addon: Prettier`
        ).start();
        const { message: prettierMsg, success: prettierSuccess } =
          await scaffoldAddOns('prettier', cliAnswers.loggerMode)();
        if (!prettierSuccess) {
          prettierSpinner.fail(prettierMsg);
          ConsoleLogger.printLog(`Error: ${prettierMsg}`, 'error');
          process.exit(1);
        }
        prettierSpinner.succeed();
      }

      const psSetupSpinner = ora(
        `Running post-scaffold operations and making your ${STRING_CONSTANTS.STORM_BRANDED} project runnable...`
      ).start();
      const { message: psMessage, success: psSuccess } =
        await scaffoldPost(cliAnswers);
      if (!psSuccess) {
        psSetupSpinner.fail(psMessage);
        ConsoleLogger.printLog(`Error: ${psMessage}`, 'error');
        process.exit(1);
      }
      psSetupSpinner.succeed();
    },
    // handles verbose-mode installation
    verbose: async function (): Promise<void> {
      // install showing verbose logs
      // 1. Scaffold backend / core
      const coreSetupResult = await scaffoldCore(cliAnswers);

      if (!coreSetupResult.success) {
        ConsoleLogger.printLog(
          `Scaffold process failed with error: ${coreSetupResult.message}`,
          'error'
        );
        process.exit(1);
      }

      // 2. Scaffold frontend
      const frontendSetupResult = await scaffoldFrontend(cliAnswers);

      if (!frontendSetupResult.success) {
        ConsoleLogger.printLog(
          `Scaffold process failed with error: ${frontendSetupResult.message}`,
          'error'
        );
        process.exit(1);
      }

      // 2. Scaffold Add-ons
      const addOns = buildAddOns(cliAnswers);
      await installScaffoldAddOns(addOns, cliAnswers.loggerMode);

      // 3. Post Scaffold
      const postScaffoldResult = await scaffoldPost(cliAnswers);

      if (!postScaffoldResult.success) {
        ConsoleLogger.printLog(
          `Scaffold process failed with error: ${postScaffoldResult.message}`,
          'error'
        );
        process.exit(1);
      }
    },
  };

  return cliInstallOpts[cliAnswers.loggerMode];
}
