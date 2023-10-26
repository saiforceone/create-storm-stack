/**
 * @author SaiForceOne
 * @description Messaging shown when the scaffold process is completed
 */
// core & third-party imports
import chalk from 'chalk';

// ST🌀RM Stack Imports
import { STRING_CONSTANTS } from '../constants/stringConstants.js';
import ScaffoldOpts = STRMStackCLI.ScaffoldOpts;

/**
 * @function printScaffoldSummary
 * @param {ScaffoldOpts} scaffoldOpts
 * @description Prints out the scaffold summary based on the options selected during
 * the prompts
 */
export function printScaffoldSummary(scaffoldOpts: ScaffoldOpts): void {
  console.log(`
 ${chalk.bold(`Your ${STRING_CONSTANTS.STORM_BRANDED} project is ready to go!`)}
  
 ${chalk.underline('Project Summary')}\n
 Project Name: ${chalk.greenBright.bold(scaffoldOpts.projectName)}
 Frontend: ${chalk.greenBright.bold(scaffoldOpts.frontend)}
  
 ${chalk.bold(`Running your ${STRING_CONSTANTS.STORM_BRANDED} Stack project`)}\n
 1. Navigate to the directory: ${chalk.greenBright(
   'cd ' + scaffoldOpts.projectName
 )}
 2. Activate the virtual environment: ${chalk.greenBright('pipenv shell')}
 3. Run the project: ${chalk.greenBright('npm run strm-dev')}
 4. In your browser, navigate to: ${chalk.greenBright('http://127.0.0.1:5000')}
 
 Happy C🌀ding!
`);
}
