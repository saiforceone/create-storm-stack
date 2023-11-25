/**
 * @author SaiForceOne
 * @description Advanced CLI program for the STRM Stack CLI
 */

// Core & third-party imports
import chalk from 'chalk';
import { Command } from 'commander';

// STRM Stack imports
import { getCLIVersion, loadLocaleFile } from './utils/cliUtils.js';
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

    return program;
  } catch (e) {
    chalk.redBright(e.message);
  }
}
