/**
 * @author SaiForceOne
 * @description Scaffold functions that run at the end of the scaffold process.
 * Typically, this would be functions to update config files as well as printing
 * project running instructions to the user, etc
 */
import ScaffoldOpts = STRMStackCLI.ScaffoldOpts;
import ScaffoldOutput = STRMStackCLI.ScaffoldOutput;
import { buildScaffoldOutput } from '../utils/generalUtils.js';
import {
  buildInitialEnvAtDest,
  renameFilesAtDest,
  updateProjectConfiguration,
  updateProjectPkgFile,
} from '../utils/scaffoldUtils.js';

/**
 * @function scaffoldPost
 * @param scaffoldOptions
 * @returns {Promise<ScaffoldOutput>}
 * @description completes the scaffold process by updating the necessary config
 * files and printing the scaffold summary to the user
 */
export async function scaffoldPost(
  scaffoldOptions: ScaffoldOpts
): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  try {
    const overwriteConfigResult = await updateProjectConfiguration(
      process.cwd(),
      scaffoldOptions
    );

    if (!overwriteConfigResult.success) {
      output.message = overwriteConfigResult.message;
      return output;
    }

    const overwritePkgResult = await updateProjectPkgFile(
      process.cwd(),
      scaffoldOptions
    );

    if (!overwritePkgResult.success) {
      output.message = overwritePkgResult.message;
      return output;
    }

    // write .env file to destination
    const writeEnvResult = await buildInitialEnvAtDest(
      process.cwd(),
      scaffoldOptions
    );

    if (!writeEnvResult.success) {
      output.message = writeEnvResult.message;
      return output;
    }

    const renameFilesResult = await renameFilesAtDest(process.cwd());

    if (!renameFilesResult.success) {
      output.message = renameFilesResult.message;
      return output;
    }

    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}
