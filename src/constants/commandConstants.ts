/**
 * @author SaiForceOne
 * @description a collection of command line constants
 * */
import STORMProjectScript = STORMStackCLI.STORMProjectScript;

export const COMMAND_CONSTANTS = {
  CMD_PIPENV: 'pipenv shell',
  CMD_PIPENV_INSTALL: 'pipenv install',
  CMD_NPM_NORMAL_INSTALL: 'npm i',
  CMD_NPM_DEV_INSTALL: 'npm i -D',
  CMD_GIT_INIT: 'git init',
  CMD_NPM_RUN_STORM_DEV:
    'concurrently -c auto --names st🌀rm-be,st🌀rm-fe,st🌀rm-tw "PYTHONUNBUFFERED=1 exec uvicorn app:app --reload --port 5000" "npm run vite-dev" "npm run tw-dev"',
  CMD_NPM_RUN_STORM_DEV_WIN:
    'concurrently -c auto --names st🌀rm-be,st🌀rm-fe,st🌀rm-tw "py uvicorn app:app --reload --port 5000" "npm run vite-dev" "npm run tw-dev"',
} as const;

export const PKG_SCRIPTS: STORMProjectScript[] = [
  {
    name: 'storm-dev',
    command: COMMAND_CONSTANTS.CMD_NPM_RUN_STORM_DEV,
  },
];

export const PKG_SCRIPTS_WINDOWS: STORMProjectScript[] = [
  {
    name: 'storm-dev',
    command: '',
  },
];
