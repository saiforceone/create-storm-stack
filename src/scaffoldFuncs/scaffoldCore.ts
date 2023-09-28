/**
 * @author SaiForceOne
 * @description Core scaffold function implementation. Set's up everything to do
 * with the Flask side of the project and copies relevant template files
 */
import path from 'node:path';

import ScaffoldOpts = FTLStackCLI.ScaffoldOpts;
import ScaffoldOutput = FTLStackCLI.ScaffoldOutput;
import { buildScaffoldOutput } from '../utils/generalUtils.js';
import { setupProjectDir, setupVirtualEnv } from '../utils/scaffoldUtils.js';

/**
 * @async
 * @function scaffoldCore
 * @param scaffoldOptions
 * @description Performs scaffold operations such as, making sure the target
 */
export async function scaffoldCore(
  scaffoldOptions: ScaffoldOpts
): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  try {
    // 1. Destination setup
    const projectSetupResult = await setupProjectDir(
      scaffoldOptions.projectName
    );

    if (!projectSetupResult.success) {
      output.message = projectSetupResult.message;
      return output;
    }

    // 2. Environment initialization
    const projectPath = path.join(process.cwd(), scaffoldOptions.projectName);
    const envInitResult = await setupVirtualEnv(projectPath);

    console.log(envInitResult);

    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}
