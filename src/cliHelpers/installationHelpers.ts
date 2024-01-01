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
import { scaffoldCore } from '../scaffoldFuncs/scaffoldCore.js';
import { ConsoleLogger } from '../utils/consoleLogger.js';
import { scaffoldFrontend } from '../scaffoldFuncs/scaffoldFrontend.js';
import { scaffoldPost } from '../scaffoldFuncs/scaffoldPost.js';
import {
  buildAddOns,
  installScaffoldAddOns,
  scaffoldAddOns,
} from '../scaffoldFuncs/scaffoldAddOns.js';
import { LocaleManager } from './localeManager.js';

/**
 * @function execCLIInstallation
 * @param {ScaffoldOpts} cliAnswers contains the prompts from the user
 * @description Helper function that get the installation options based on the
 * CLI logger mode selected
 */
export function execCLIInstallation(cliAnswers: ScaffoldOpts) {
  const LocaleData = LocaleManager.getInstance().getLocaleData();
  const cliInstallOpts: Record<STRMStackCLI.LoggerMode, () => Promise<void>> = {
    // handles quiet-mode installation
    quiet: async function (): Promise<void> {
      // set up ora spinners
      const coreSetupSpinner = ora(
        LocaleData.backend.info.INSTALL_BASE_DEPS
      ).start();
      const { message: coreMessage, success: coreSuccess } =
        await scaffoldCore(cliAnswers);
      if (!coreSuccess) {
        coreSetupSpinner.fail(coreMessage);
        process.exit(1);
      }
      coreSetupSpinner.succeed();

      const feSetupSpinner = ora(
        `${LocaleData.frontend.info.INSTALL_FE_DEPS} (${chalk.bold(
          cliAnswers.frontend
        )})...`
      ).start();
      const { message: feMessage, success: feSuccess } =
        await scaffoldFrontend(cliAnswers);
      if (!feSuccess) {
        feSetupSpinner.fail(feMessage);
        process.exit(1);
      }
      feSetupSpinner.succeed();

      if (cliAnswers.installPrettier) {
        const prettierSpinner = ora(
          `${LocaleData.frontend.info.INSTALL_FE_ADDON}: Prettier`
        ).start();
        const { message: prettierMsg, success: prettierSuccess } =
          await scaffoldAddOns('prettier')();
        if (!prettierSuccess) {
          prettierSpinner.fail(prettierMsg);
          process.exit(1);
        }
        prettierSpinner.succeed();
      }

      if (cliAnswers.enableGit) {
      }

      const psSetupSpinner = ora(
        LocaleData.postScaffold.RUN_POST_PROCESSES
      ).start();
      const { message: psMessage, success: psSuccess } =
        await scaffoldPost(cliAnswers);
      if (!psSuccess) {
        psSetupSpinner.fail(psMessage);
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
        ConsoleLogger.printLog(`${coreSetupResult.message}`, 'error');
        process.exit(1);
      }

      // 2. Scaffold frontend
      const frontendSetupResult = await scaffoldFrontend(cliAnswers);

      if (!frontendSetupResult.success) {
        ConsoleLogger.printLog(`${frontendSetupResult.message}`, 'error');
        process.exit(1);
      }

      // 2. Scaffold Add-ons
      const addOns = buildAddOns(cliAnswers);
      await installScaffoldAddOns(addOns, cliAnswers.loggerMode);

      // 3. Post Scaffold
      const postScaffoldResult = await scaffoldPost(cliAnswers);

      if (!postScaffoldResult.success) {
        ConsoleLogger.printLog(`${postScaffoldResult.message}`, 'error');
        process.exit(1);
      }
    },
  };

  return cliInstallOpts[cliAnswers.loggerMode];
}
