/**
 * @author SaiForceOne
 * @description Collection of general-use utility functions
 */

// exclude starting with
const VALID_DESTINATION_PATTERN = /^[a-z]\w+$/gim;

/**
 * @description Helper function to validate a project name. Valid project names should start with a letter and not
 * contain spaces or dashes
 * @param {string} projectName
 * @returns {*}
 */
export function validateProjectName(projectName: string) {
  if (!projectName) return;
  return projectName.match(VALID_DESTINATION_PATTERN);
}
