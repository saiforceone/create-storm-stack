#! /usr/bin/env node

import process from 'node:process';

/**
 * @function execCli
 * @description CLI execution function
 * @param args
 * @returns {Promise<void>}
 */
async function execCli(args) {
  const { cli } = await import('../dist/cli.js');
  cli().then();
}

execCli(process.argv).then();