/**
 * @author SaiForceOne
 * @description Handles installing of ST🌀RM Stack Add ons when they are selected
 * from the CLI prompts
 */
import ScaffoldOutput = STORMStackCLI.ScaffoldOutput;
import {buildScaffoldOutput} from '../utils/generalUtils.js';
import {installPrettier, installSentry, installSentryForFrontend} from '../utils/scaffoldAddOnUtils.js';
import STORMAddOn = STORMStackCLI.STORMAddOn;
import LoggerMode = STORMStackCLI.LoggerMode;
import ScaffoldOpts = STORMStackCLI.ScaffoldOpts;
import {ConsoleLogger} from '../utils/consoleLogger.js';
import {LocaleManager} from '../cliHelpers/localeManager.js';
import STORMBEAddon = STORMStackCLI.STORMBEAddon;
import STORMFEAddon = STORMStackCLI.STORMFEAddon;
import STORMCodeQualityAddon = STORMStackCLI.STORMCodeQualityAddon;
import FrontendOpt = STORMStackCLI.FrontendOpt;

function buildDummyOutput() {
  const output = buildScaffoldOutput();
  output.message = 'Not implemented';
  return output;
}


/**
 * @deprecated
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
    sentry: async function () {
      return await installSentry(process.cwd());
    }
  };

  return addOnInstallOpts[stormAddOn];
}

/**
 * @function scaffoldBackendAddons
 * @description Helper function that installs backend addons for the STORM stack
 * @param {STORMBEAddon} stormBEAddon the addon to be installed
 */
export function scaffoldBackendAddons(stormBEAddon: STORMBEAddon) {
  const backendAddonInstallOpts: Record<STORMBEAddon, () => Promise<ScaffoldOutput>> = {
    sentry: async function (): Promise<ScaffoldOutput> {
      return await installSentry(process.cwd());
    },
    vercel: async function(): Promise<ScaffoldOutput> {
      return buildDummyOutput();
    }
  }
  return backendAddonInstallOpts[stormBEAddon];
}

/**
 * @function scaffoldFrontendAddons
 * @description Helper function that installs frontend addons for the STORM stack
 * @param {STORMFEAddon} stormFEAddon
 * @param {FrontendOpt} frontendOpt
 */
export function scaffoldFrontendAddons(stormFEAddon: STORMFEAddon, frontendOpt: FrontendOpt) {
  const frontendAddonInstallOpts: Record<STORMFEAddon, () => Promise<ScaffoldOutput>> = {
    sentry: async function(): Promise<ScaffoldOutput> {
      return installSentryForFrontend(process.cwd(), frontendOpt);
    },
    storybook: async function(): Promise<ScaffoldOutput> {
      return buildDummyOutput();
    },
    vitest: async function(): Promise<ScaffoldOutput> {
      return buildDummyOutput();
    }

  }
  return frontendAddonInstallOpts[stormFEAddon];
}

/**
 * @function scaffoldCodeQualityAddons
 * @description Helper function that installs code quality addons for the STORM stack
 * @param {STORMCodeQualityAddon} stormQCAddon
 */
export function scaffoldCodeQualityAddons(stormQCAddon: STORMCodeQualityAddon) {
  const codeQualityAddonInstallOpts: Record<STORMCodeQualityAddon, () => Promise<ScaffoldOutput>> = {
    prettier: async function(): Promise<ScaffoldOutput> {
      return await installPrettier(process.cwd());
    },
    eslint: async function(): Promise<ScaffoldOutput> {
      return buildDummyOutput();
    },
    pycodestyle: async function(): Promise<ScaffoldOutput> {
      return buildDummyOutput();
    }
  }
  return codeQualityAddonInstallOpts[stormQCAddon];
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
 * @function installBEAddons
 * @description Handles installing backend addons into a STORM stack project
 * @param {Array<STORMBEAddon>} backendAddons
 * @param {LoggerMode} loggerMode
 */
export async function installBEAddons(backendAddons: Array<STORMBEAddon>, loggerMode: LoggerMode): Promise<void> {
  const verbose = loggerMode === 'verbose';

  for (const addon of backendAddons) {
    if (verbose) ConsoleLogger.printCLIProcessInfoMessage(`Installing Backend Addon`, addon);
    const addOnResult = await scaffoldBackendAddons(addon)();

    if (!addOnResult.success) {
      if (verbose) ConsoleLogger.printCLIProcessErrorMessage(`${addOnResult.message}`);
      process.exit(1);
    }

    if (verbose) ConsoleLogger.printCLIProcessSuccessMessage({message: 'Successfully installed addon'});
  }
}

/**
 * @function installFEAddons
 * @description Handles installing Frontend addons into a STORM stack project
 * @param {Array<STORMFEAddon>} frontendAddons
 * @param {FrontendOpt} frontendOpt
 * @param {LoggerMode} loggerMode
 */
export async function installFEAddons(frontendAddons: Array<STORMFEAddon>, frontendOpt: FrontendOpt, loggerMode: LoggerMode): Promise<void> {
  const verbose = loggerMode === 'verbose';
  for (const addon of frontendAddons) {
    if (verbose) ConsoleLogger.printCLIProcessInfoMessage(`Installing Frontend Addon`, addon);

    const addonResult = await scaffoldFrontendAddons(addon, frontendOpt)();

    if (!addonResult.success) {
      if (verbose) {
        ConsoleLogger.printCLIProcessErrorMessage(
          `${addonResult.message}`
        );
      }
      process.exit(1);
    }

    if (verbose) ConsoleLogger.printCLIProcessSuccessMessage({
      message: 'Successfully installed frontend addon',
    });
  }
}

/**
 * @function installCQAddons
 * @description handles installation of code quality addons into a STORM stack project
 * @param {Array<STORMCodeQualityAddon>} codeQualityAddons
 * @param {LoggerMode} loggerMode
 */
export async function installCQAddons(codeQualityAddons: Array<STORMCodeQualityAddon>, loggerMode: LoggerMode): Promise<void> {
  const verbose = loggerMode === 'verbose';
  for (const addon of codeQualityAddons) {
    if (verbose) ConsoleLogger.printCLIProcessInfoMessage(`Installing Code Quality addons`, addon);
    const addonResult = await scaffoldCodeQualityAddons(addon)();
    if (!addonResult.success) {
      if (verbose) ConsoleLogger.printCLIProcessErrorMessage(`${addonResult.message}`);
      process.exit(1);
    }
    if (verbose) ConsoleLogger.printCLIProcessSuccessMessage({
      message: 'Successfully installed code quality addon',
      detail: addon,
    });
  }
}

/**
 * @deprecated
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
