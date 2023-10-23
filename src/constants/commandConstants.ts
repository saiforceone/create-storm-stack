/**
 * @author SaiForceOne
 * @description a collection of command line constants
 * */

export const COMMAND_CONSTANTS = {
  CMD_PIPENV: 'pipenv shell',
  CMD_PIPENV_INSTALL: 'pipenv install',
  CMD_NPM_NORMAL_INSTALL: 'npm i',
  CMD_NPM_DEV_INSTALL: 'npm i -D',
} as const;
