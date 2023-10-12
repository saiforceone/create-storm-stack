/**
 * @author SaiForceOne
 * @description Scaffold functions that run at the end of the scaffold process.
 * Typically, this would be functions to update config files as well as printing
 * project running instructions to the user, etc
 */
import ScaffoldOpts = FTLStackCLI.ScaffoldOpts;
import ScaffoldOutput = FTLStackCLI.ScaffoldOutput;
import { buildScaffoldOutput } from '../utils/generalUtils.js';
import { updateProjectConfiguration } from '../utils/scaffoldUtils.js';

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
    // 1. Overwrite the project config file
    const overwriteConfigResult = await updateProjectConfiguration(
      process.cwd(),
      scaffoldOptions
    );

    if (!overwriteConfigResult.success) {
      output.message = overwriteConfigResult.message;
      return output;
    }

    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}
