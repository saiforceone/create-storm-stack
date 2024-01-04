/**
 * @author SaiForceOne
 * @description Advanced CLI program for the ST🌀RM Stack CLI
 */

// Core & third-party imports
import chalk from 'chalk';
import { Command } from 'commander';

// ST🌀RM Stack imports
import {
  checkSTORMProject,
  createSTORMModule,
  execDependencyChecks,
  getCLIVersion,
  loadLocaleFile,
  preScaffoldCommandExecCheck,
} from './utils/cliUtils.js';
import { LocaleManager } from './cliHelpers/localeManager.js';
import { printPreScaffoldMessage } from './cliHelpers/printPreScaffoldMessage.js';
import { validateProjectOrModuleName } from './utils/generalUtils.js';
import STORMModuleArgs = STORMStackCLI.STORMModuleArgs;
import { ConsoleLogger } from './utils/consoleLogger.js';

/**
 * @async
 * @description Sets up commander with localized strings which is callable by `create-storm-stack`
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
        const validProjectResponse = await checkSTORMProject(
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

    /**
     * make-module
     * @description adds a ST🌀RM Stack module where a module is made up of a
     * controller (backend), model (backend) and frontend page components
     * @example npx @saiforceone/create-storm-stack --make-module --name <module_name> [-options]
     * The make-module command will have structure as defined above.
     */
    program
      .command('make-module')
      .alias('makeModule')
      .description(localeData.advCli.descriptions.MAKE_MODULE_CMD)
      .requiredOption(
        '-n --name <name>',
        localeData.advCli.descriptions.MODULE_NAME
      )
      .option(
        '-plural --plural <plural>',
        localeData.advCli.descriptions.MODULE_PLURAL
      )
      .option(
        '-controllerOnly --controllerOnly',
        localeData.advCli.descriptions.CONTROLLER_ONLY
      )
      .action(async (args) => {
        await execDependencyChecks();

        const { success: isProjectValid } = await checkSTORMProject(
          process.cwd()
        );
        if (!isProjectValid) {
          ConsoleLogger.printCLIProcessErrorMessage(
            localeData.advCli.responses.PROJECT_APPEARS_INVALID
          );
          process.exit(1);
        }

        const moduleArgs = args as STORMModuleArgs;

        // validate the module name
        const isValidModuleName = validateProjectOrModuleName(moduleArgs.name);
        if (!isValidModuleName) {
          ConsoleLogger.printCLIProcessErrorMessage(
            localeData.advCli.responses.INVALID_MODULE_NAME
          );
          process.exit(1);
        }

        ConsoleLogger.printCLIProcessInfoMessage(
          `${localeData.advCli.info.MODULE_CREATE}: ${args['name']}...`
        );
        const makeModuleResult = await createSTORMModule(moduleArgs);
        makeModuleResult.success
          ? ConsoleLogger.printCLIProcessSuccessMessage({
              message: `${localeData.advCli.success.MODULE_CREATE}`,
              detail: args['name'],
            })
          : ConsoleLogger.printCLIProcessErrorMessage(
              `${localeData.advCli.error.MODULE_CREATE}${
                makeModuleResult.message
                  ? ` ERR: ${makeModuleResult.message}`
                  : ''
              }`
            );
      });

    /**
     * command: check-requirements
     * @description Checks if ST🌀RM Stack dependencies are installed on the
     * target system. Requirements: Python 3.8+, pipenv, nodejs 16.7+
     */
    program
      .command('check-requirements')
      .alias('checkRequirements')
      .description(localeData.advCli.descriptions.CHECK_SYSTEM_DEPS)
      .action(async () => {
        const execCheckResult = await preScaffoldCommandExecCheck(true);
        execCheckResult.success
          ? ConsoleLogger.printCLIProcessSuccessMessage({
              message: localeData.advCli.success.CHECK_SYSTEM_DEPENDENCIES,
            })
          : ConsoleLogger.printCLIProcessErrorMessage(
              localeData.advCli.error.CHECK_SYSTEM_DEPENDENCIES
            );
      });

    return program;
  } catch (e) {
    ConsoleLogger.printCLIProcessErrorMessage(e.message);
  }
}
