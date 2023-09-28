/**
 * @author SaiForceOne
 * @description a collection of utility functions related to the scaffolding
 * process
 */

// Core & third-party imports
import path from 'node:path';
import { access, constants, mkdir } from 'node:fs/promises';
import { $, execa, execaCommand } from 'execa';

// FTL Imports
import ScaffoldOutput = FTLStackCLI.ScaffoldOutput;
import { buildScaffoldOutput } from './generalUtils.js';
import { destinationPathExists } from './fileUtils.js';
import { PROJECT_DEST_EXISTS } from '../constants/errorConstants.js';
import { CMD_PIPENV } from '../constants/commandConstants.js';

/**
 * @function setupProjectDir
 * @param {string} projectName
 * @description Sets up the project destination directory
 */
export async function setupProjectDir(
  projectName: string
): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  try {
    // 0. check that the destination does not already exist
    const targetPath = path.join(process.cwd(), projectName);

    // 1. check the destination
    if (await destinationPathExists(targetPath)) {
      output.message = 'Project destination already exists';
      // exit
      return output;
    }

    // 2. make target directory
    await mkdir(targetPath);

    // 3. check destination access
    await access(targetPath, constants.W_OK);

    output.message = PROJECT_DEST_EXISTS;
    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}

export async function setupVirtualEnv(
  projectPath: string
): Promise<ScaffoldOutput> {
  const output = buildScaffoldOutput();
  try {
    // 1. cd / navigate to project path
    process.chdir(projectPath);
    // 2. execute command to create environment
    // execaCommand(CMD_PIPENV).stdout?.pipe(process.stdout);
    // const { stdout } = await execaCommand(CMD_PIPENV);
    // console.log(stdout);
    // console.log('should happen after pipenv shell...');
    // 3. load flask dependencies and install them
    // 4. hand off to scaffold core function

    output.success = true;
    return output;
  } catch (e) {
    output.message = (e as Error).message;
    return output;
  }
}
