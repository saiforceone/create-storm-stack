/**
 * @author SaiForceOne
 * @description a collection of command line constants
 * */
import STRMProjectScript = STRMStackCLI.STRMProjectScript;

export const COMMAND_CONSTANTS = {
  CMD_PIPENV: 'pipenv shell',
  CMD_PIPENV_INSTALL: 'pipenv install',
  CMD_NPM_NORMAL_INSTALL: 'npm i',
  CMD_NPM_DEV_INSTALL: 'npm i -D',
  CMD_GIT_INIT: 'git init',
  CMD_NPM_RUN_STRM_DEV:
    'concurrently -c auto --names strm-be,strm-fe,strm-tw "PYTHONUNBUFFERED=1 exec uvicorn app:app --reload --port 5000" "npm run vite-dev" "npm run tw-dev"',
} as const;

export const PKG_SCRIPTS: STRMProjectScript[] = [
  {
    name: 'strm-dev',
    command: COMMAND_CONSTANTS.CMD_NPM_RUN_STRM_DEV,
  },
];
