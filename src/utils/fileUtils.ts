/**
 * @author SaiForceOne
 * @description A collection of utility functions specific to the filesystem
 */

import { stat } from 'node:fs/promises';

/**
 * @async
 * @function destinationPathExists
 * @param {string} path - represents the destination the project should be generated in
 * @return Promise<boolean>
 */
export async function destinationPathExists(path: string): Promise<boolean> {
  try {
    const fileStats = await stat(path);
    return !!fileStats;
  } catch (e) {
    return false;
  }
}

export function isInProjectDir(path: string): boolean {
  return process.cwd() === path;
}
