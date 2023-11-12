/**
 * @author SaiForceOne
 * @description Frontend scaffold function implementation. Sets up everything to
 * do with the Frontend of the project and copies relevant files
 */

// STRM Stack imports
import ScaffoldOpts = STRMStackCLI.ScaffoldOpts;
import ScaffoldOutput = STRMStackCLI.ScaffoldOutput;
import { buildScaffoldOutput } from '../utils/generalUtils.js';
import {
  copyFrontendResources,
  copyFrontendTemplates,
  setupBaseFrontend,
  setupFrontend,
} from '../utils/scaffoldUtils.js';
import { LocaleManager } from '../cliHelpers/localeManager.js';

/**
 * @async
 * @param {ScaffoldOpts} scaffoldOptions
 * @returns {Promise<ScaffoldOutput>}
 * @description Scaffolds the frontend of the project based on the scaffold
 * options provided
 */
export async function scaffoldFrontend(
  scaffoldOptions: ScaffoldOpts
): Promise<ScaffoldOutput> {
  const LocaleData = LocaleManager.getInstance().getLocaleData();
  const output = buildScaffoldOutput();
  try {
    // 1. install base vite dependencies
    const baseDepsResult = await setupBaseFrontend(
      process.cwd(),
      scaffoldOptions.loggerMode
    );

    if (!baseDepsResult.success) {
      output.message = baseDepsResult.message;
      return output;
    }

    // 2. install frontend dependencies for the chosen frontend
    const frontendResult = await setupFrontend(
      scaffoldOptions.frontend,
      scaffoldOptions.loggerMode
    );

    if (!frontendResult.success) {
      output.message = frontendResult.message;
      return output;
    }

    // 3. copy frontend template files to destination
    const frontendCopyResult = await copyFrontendTemplates(
      process.cwd(),
      scaffoldOptions.frontend,
      scaffoldOptions.loggerMode
    );

    if (!frontendCopyResult.success) {
      output.message = frontendCopyResult.message;
      return output;
    }

    // 4. copy frontend resources and configs
    const feResourceCopyResult = await copyFrontendResources(
      process.cwd(),
      scaffoldOptions
    );

    if (!feResourceCopyResult.success) {
      output.message = feResourceCopyResult.message;
      return output;
    }

    output.message = `${LocaleData.frontend.success.INSTALL_FE_DEPS} (${scaffoldOptions.frontend})`;
    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}
