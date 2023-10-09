/**
 * @author SaiForceOne
 * @description Core scaffold function implementation. Set's up everything to do
 * with the Flask side of the project and copies relevant template files
 */
import path from 'node:path';

import ScaffoldOpts = FTLStackCLI.ScaffoldOpts;
import ScaffoldOutput = FTLStackCLI.ScaffoldOutput;
import { buildScaffoldOutput } from '../utils/generalUtils.js';
import {
  copyFlaskTemplateFiles,
  setupProjectDir,
  setupVirtualEnv,
} from '../utils/scaffoldUtils.js';

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

    // 2. Environment initialization and flask installation
    const projectPath = path.join(process.cwd(), scaffoldOptions.projectName);

    const envInitResult = await setupVirtualEnv(
      projectPath,
      scaffoldOptions.loggerMode
    );

    if (!envInitResult.success) {
      output.message = envInitResult.message;
      return output;
    }

    // 3. Copy template files
    const copyFlaskTemplatesResult = await copyFlaskTemplateFiles(
      projectPath,
      scaffoldOptions.loggerMode
    );

    console.log('copy template result: ', copyFlaskTemplatesResult);

    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}
