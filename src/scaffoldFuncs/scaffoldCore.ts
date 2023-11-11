/**
 * @author SaiForceOne
 * @description Core scaffold function implementation. Set's up everything to do
 * with the Starlette side of the project and copies relevant template files
 */
import path from 'node:path';

import ScaffoldOpts = STRMStackCLI.ScaffoldOpts;
import ScaffoldOutput = STRMStackCLI.ScaffoldOutput;
import { buildScaffoldOutput } from '../utils/generalUtils.js';
import {
  copyWebTemplateFiles,
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

    // 2. Environment initialization and Starlette installation
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
    const copyStarletteTemplatesResult = await copyWebTemplateFiles(
      projectPath,
      scaffoldOptions.loggerMode
    );

    if (!copyStarletteTemplatesResult.success) {
      output.message = copyStarletteTemplatesResult.message;
      return output;
    }

    output.success = true;
    return output;
  } catch (e) {
    console.error('scaffold core', e);
    output.message = (e as Error).message;
    return output;
  }
}
