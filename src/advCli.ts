/**
 * @author SaiForceOne
 * @description Advanced CLI program for the STRM Stack CLI
 */

// Core & third-party imports
import chalk from 'chalk';
import { Command } from 'commander';

// STRM Stack imports
import {
  checkSTRMProject,
  getCLIVersion,
  loadLocaleFile,
} from './utils/cliUtils.js';
import { LocaleManager } from './cliHelpers/localeManager.js';
import { printPreScaffoldMessage } from './cliHelpers/printPreScaffoldMessage.js';

/**
 * @async
 * @description Sets up commander with localized strings which is callable by `create-strm-stack`
 * @returns {Promise<Command|undefined>}
 */
export async function advCLI(): Promise<Command | undefined> {
  try {
    // get the system locale
    const locale = new Intl.NumberFormat().resolvedOptions().locale;
    const localeParts = locale.split('-');
    if (!localeParts.length) {
      return;
    }
    await loadLocaleFile(localeParts[0]!);

    const localeData = LocaleManager.getInstance().getLocaleData();

    printPreScaffoldMessage();

    // Commander program setup
    const program = new Command();

    // commands with options
    program
      .name(localeData.misc.STORM_BRANDED)
      .description(localeData.advCli.descriptions.PROGRAM);

    // info command to show CLI version
    program
      .command('info')
      .alias('version')
      .description(localeData.advCli.descriptions.INFO_CMD)
      .action(async () => {
        const version = await getCLIVersion();
        console.log(
          chalk.blue(
            `${localeData.misc.STORM_BRANDED}: ${chalk.bold.blueBright(
              version
            )}`
          )
        );
      });

    // check-project command
    program
      .command('check-project')
      .description(
        'checks that the current directory contains a valid project.'
      )
      .action(async () => {
        const validProjectResponse = await checkSTRMProject(
          process.cwd(),
          true
        );
        console.log(
          chalk.dim(
            `${
              validProjectResponse.success
                ? chalk.greenBright.bold(
                    localeData.advCli.responses.PROJECT_APPEARS_VALID
                  )
                : chalk.redBright.bold(
                    localeData.advCli.responses.PROJECT_APPEARS_INVALID
                  )
            }`
          )
        );
      });

    // add module command - adds a controller and frontend pages
    // todo: add localized strings
    program
      .command('make-module')
      .description(
        'Generates a module where a module is comprised of a controller, associated frontend pages and necessary routing on both the backend and frontend'
      )
      .option('-n --name <name>', 'the name of the module to be added')
      .option(
        '-indexOnly --indexOnly',
        'specifies that the module will only have an index'
      )
      .action(async (args) => {
        const { success: isProjectValid } = await checkSTRMProject(
          process.cwd()
        );
        if (!isProjectValid) {
          console.log(
            chalk.redBright.bold(
              localeData.advCli.responses.PROJECT_APPEARS_INVALID
            )
          );
          process.exit(1);
        }
        console.log('make-module with args: ', args);
        console.log(
          chalk.greenBright.bold(
            `✅ Project is valid. Creating module: ${args['name']}`
          )
        );
      });

    return program;
  } catch (e) {
    chalk.redBright(e.message);
  }
}
