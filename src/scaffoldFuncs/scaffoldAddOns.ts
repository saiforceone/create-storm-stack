/**
 * @author SaiForceOne
 * @description Handles installing of ST🌀RM Stack Add ons when they are selected
 * from the CLI prompts
 */
import ScaffoldOutput = STORMStackCLI.ScaffoldOutput;
import { buildScaffoldOutput } from '../utils/generalUtils.js';
import { installPrettier, installSentry } from '../utils/scaffoldAddOnUtils.js';
import STORMAddOn = STORMStackCLI.STORMAddOn;
import LoggerMode = STORMStackCLI.LoggerMode;
import ScaffoldOpts = STORMStackCLI.ScaffoldOpts;
import { ConsoleLogger } from '../utils/consoleLogger.js';
import { LocaleManager } from '../cliHelpers/localeManager.js';

function buildDummyOutput() {
  const output = buildScaffoldOutput();
  output.message = 'Not implemented';
  return output;
}



/**
 * @description "object literal" to handle getting functions to install add ons
 * @param {STORMAddOn} stormAddOn
 */
export function scaffoldAddOns(stormAddOn: STORMAddOn) {
  const addOnInstallOpts: Record<STORMAddOn, () => Promise<ScaffoldOutput>> = {
    prettier: async function () {
      return await installPrettier(process.cwd());
    },
    eslint: async function () {
      return buildDummyOutput();
    },
    storybook: async function () {
      return buildDummyOutput();
    },
    vitetest: async function () {
      return buildDummyOutput();
    },
    sentry: async function() {
      return await installSentry(process.cwd());
    }
  };

  return addOnInstallOpts[stormAddOn];
}

/**
 * // todo: remove this once installing addons via other prompt works properly
 * @deprecated
 * @function buildAddOns
 * @param scaffoldOpts
 * @description Helper function that returns a list of ST🌀RM Stack addons based on
 * project options (scaffoldOpts)
 */
export function buildAddOns(scaffoldOpts: ScaffoldOpts): Array<STORMAddOn> {
  const addOnsList: Array<STORMAddOn> = [];

  if (scaffoldOpts.installPrettier) addOnsList.push('prettier')

  return addOnsList;
}

/**
 *
 * @param {Array<STORMAddOn>} addOnOpts
 * @param {LoggerMode} loggerMode
 * @description Handles installation of all scaffold options
 */
export async function installScaffoldAddOns(
  addOnOpts: Array<STORMAddOn>,
  loggerMode: LoggerMode
): Promise<void> {
  const LocaleData = LocaleManager.getInstance().getLocaleData();
  const verbose = loggerMode === 'verbose';
  for (const addOn of addOnOpts) {
    if (verbose)
      ConsoleLogger.printLog(
        `${LocaleData.frontend.info.INSTALL_FE_ADDON}: ${addOn}`
      );
    const addOnFuncResult = await scaffoldAddOns(addOn)();
    if (!addOnFuncResult.success) {
      ConsoleLogger.printLog(
        `${LocaleData.frontend.error.INSTALL_FE_ADDON}: ${addOn} -> ${addOnFuncResult.message}`,
        'error'
      );
      process.exit(1);
    }
    if (verbose)
      ConsoleLogger.printLog(
        `${LocaleData.frontend.success.INSTALL_FE_ADDON}: ${addOn}`,
        'success'
      );
  }
}
