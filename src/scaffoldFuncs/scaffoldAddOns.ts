/**
 * @author SaiForceOne
 * @description Handles installing of STRM Stack Add ons when they are selected
 * from the CLI prompts
 */
import ScaffoldOutput = STRMStackCLI.ScaffoldOutput;
import { buildScaffoldOutput } from '../utils/generalUtils.js';
import { installPrettier } from '../utils/scaffoldAddOnUtils.js';
import STRMAddOn = STRMStackCLI.STRMAddOn;
import LoggerMode = STRMStackCLI.LoggerMode;
import ScaffoldOpts = STRMStackCLI.ScaffoldOpts;
import { ConsoleLogger } from '../utils/consoleLogger.js';
import { LocaleManager } from '../cliHelpers/localeManager.js';

function buildDummyOutput() {
  const output = buildScaffoldOutput();
  output.message = 'Not implemented';
  return output;
}

/**
 * @description "object literal" to handle getting functions to install add ons
 * @param {STRMAddOn} strmAddOn
 */
export function scaffoldAddOns(strmAddOn: STRMAddOn) {
  const addOnInstallOpts: Record<STRMAddOn, () => Promise<ScaffoldOutput>> = {
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
  };

  return addOnInstallOpts[strmAddOn];
}

/**
 * @function buildAddOns
 * @param scaffoldOpts
 * @description Helper function that returns a list of STRM Stack addons based on
 * project options (scaffoldOpts)
 */
export function buildAddOns(scaffoldOpts: ScaffoldOpts): Array<STRMAddOn> {
  const addOnsList: Array<STRMAddOn> = [];

  if (scaffoldOpts.installPrettier) addOnsList.push('prettier');

  return addOnsList;
}

/**
 *
 * @param {Array<STRMAddOn>} addOnOpts
 * @param {LoggerMode} loggerMode
 * @description Handles installation of all scaffold options
 */
export async function installScaffoldAddOns(
  addOnOpts: Array<STRMAddOn>,
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
