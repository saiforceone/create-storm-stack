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
import { STRING_CONSTANTS } from '../constants/stringConstants.js';

function buildDummyOutput() {
  const output = buildScaffoldOutput();
  output.message = 'Not implemented';
  return output;
}

/**
 * @description "object literal" to handle getting functions to install add ons
 * @param {STRMAddOn} strmAddOn
 * @param {LoggerMode} loggerMode
 */
export function scaffoldAddOns(strmAddOn: STRMAddOn, loggerMode: LoggerMode) {
  const addOnInstallOpts: Record<STRMAddOn, () => Promise<ScaffoldOutput>> = {
    prettier: async function () {
      return await installPrettier(process.cwd(), loggerMode);
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
  const verbose = loggerMode === 'verbose';
  for (const addOn of addOnOpts) {
    if (verbose)
      ConsoleLogger.printLog(
        `Install ${STRING_CONSTANTS.STORM_BRANDED} Add-on: ${addOn}`
      );
    const addOnFuncResult = await scaffoldAddOns(addOn, loggerMode)();
    if (!addOnFuncResult.success) {
      ConsoleLogger.printLog(
        `Failed to install add-on: ${addOn} with error ${addOnFuncResult.message}`,
        'error'
      );
      process.exit(1);
    }
    if (verbose)
      ConsoleLogger.printLog(`Installed add-on: ${addOn}`, 'success');
  }
}
