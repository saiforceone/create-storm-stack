#! /usr/bin/env node

import process from 'node:process';

/**
 * @function execCli
 * @description CLI execution function
 * @param args
 * @returns {Promise<void>}
 */
async function execCli(args) {
  if (args.length > 2) {
    const { advCLI } = await import('../dist/advCli.js');
    const program = await advCLI();
    if (!program) {
      return console.error('uh oh :(');
    }
    program.parse();
    return;
  }
  const { cli } = await import('../dist/cli.js');
  cli().then();
}

execCli(process.argv).then();
