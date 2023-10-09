/**
 * @author SaiForceOne
 * @description Frontend scaffold function implementation. Sets up everything to
 * do with the Frontend of the project and copies relevant files
 */

// Core & third-party imports
import path from 'node:path';

// FTL Stack imports
import ScaffoldOpts = FTLStackCLI.ScaffoldOpts;
import ScaffoldOutput = FTLStackCLI.ScaffoldOutput;
import { buildScaffoldOutput } from '../utils/generalUtils.js';
import { setupBaseFrontend } from '../utils/scaffoldUtils.js';

export async function scaffoldFrontend(
  scaffoldOptions: ScaffoldOpts
): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  try {
    // 1. install base vite dependencies
    const projectPath = path.join(process.cwd(), scaffoldOptions.projectName);

    const baseDepsResult = await setupBaseFrontend(
      projectPath,
      scaffoldOptions.loggerMode
    );

    console.log(baseDepsResult);

    // return output
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}
