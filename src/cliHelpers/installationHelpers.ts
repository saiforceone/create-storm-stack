/**
 * @author SaiForceOne
 * @description Contains helper functions specific to the CLI scaffold installation
 * process.
 */
// Core & third-party imports
import chalk from 'chalk';
import ora from 'ora';

// STORM Stack Imports
import ScaffoldOpts = STORMStackCLI.ScaffoldOpts;
import {scaffoldCore} from '../scaffoldFuncs/scaffoldCore.js';
import {ConsoleLogger} from '../utils/consoleLogger.js';
import {scaffoldFrontend} from '../scaffoldFuncs/scaffoldFrontend.js';
import {scaffoldPost} from '../scaffoldFuncs/scaffoldPost.js';
import {
  installBEAddons, installCQAddons, installFEAddons,
} from '../scaffoldFuncs/scaffoldAddOns.js';
import {LocaleManager} from './localeManager.js';
import {enableGit} from '../utils/scaffoldUtils.js';

/**
 * @function execCLIInstallation
 * @param {ScaffoldOpts} cliAnswers contains the prompts from the user
 * @description Helper function that get the installation options based on the
 * CLI logger mode selected
 */
export function execCLIInstallation(cliAnswers: ScaffoldOpts) {
  const LocaleData = LocaleManager.getInstance().getLocaleData();
  const cliInstallOpts: Record<STORMStackCLI.LoggerMode, () => Promise<void>> =
    {
      // handles quiet-mode installation
      quiet: async function (): Promise<void> {
        // set up ora spinners
        const coreSetupSpinner = ora(
          LocaleData.backend.info.INSTALL_BASE_DEPS
        ).start();
        const {message: coreMessage, success: coreSuccess} =
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
        const {message: feMessage, success: feSuccess} =
          await scaffoldFrontend(cliAnswers);
        if (!feSuccess) {
          feSetupSpinner.fail(feMessage);
          process.exit(1);
        }
        feSetupSpinner.succeed();

        if (cliAnswers.stormCQAddons.length) {
          await installCQAddons(cliAnswers.stormCQAddons, cliAnswers.loggerMode);
        }

        if (cliAnswers.stormFEAddons.length) {
          await installFEAddons(cliAnswers.stormFEAddons, cliAnswers.frontend, cliAnswers.loggerMode);
        }

        if (cliAnswers.stormBEAddons.length) {
          await installBEAddons(cliAnswers.stormBEAddons, cliAnswers.loggerMode);
        }

        if (cliAnswers.enableGit) {
          const gitSpinner = ora(
            `${LocaleData.backend.info.ENABLE_GIT}`
          ).start();
          const {message: gitMsg, success: gitSuccess} = await enableGit(
            cliAnswers.loggerMode
          );
          gitSuccess ? gitSpinner.succeed() : gitSpinner.warn(gitMsg);
        }

        const psSetupSpinner = ora(
          LocaleData.postScaffold.RUN_POST_PROCESSES
        ).start();
        const {message: psMessage, success: psSuccess} =
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
        // scaffold code quality addons
        if (cliAnswers.stormCQAddons.length) {
          await installCQAddons(cliAnswers.stormCQAddons, cliAnswers.loggerMode);
        }

        if (cliAnswers.stormFEAddons.length) {
          await installFEAddons(cliAnswers.stormFEAddons, cliAnswers.frontend, cliAnswers.loggerMode);
        }

        // scaffold backend addons
        if (cliAnswers.stormBEAddons.length) {
          await installBEAddons(cliAnswers.stormBEAddons, cliAnswers.loggerMode);
        }

        // Git
        if (cliAnswers.enableGit) {
          await enableGit(cliAnswers.loggerMode);
        }

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
