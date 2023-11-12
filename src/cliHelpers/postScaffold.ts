/**
 * @author SaiForceOne
 * @description Messaging shown when the scaffold process is completed
 */
// core & third-party imports
import chalk from 'chalk';

// ST🌀RM Stack Imports
import ScaffoldOpts = STRMStackCLI.ScaffoldOpts;
import { buildAddOns } from '../scaffoldFuncs/scaffoldAddOns.js';
import { LocaleManager } from './localeManager.js';

/**
 * @function printScaffoldSummary
 * @param {ScaffoldOpts} scaffoldOpts
 * @description Prints out the scaffold summary based on the options selected during
 * the prompts
 */
export function printScaffoldSummary(scaffoldOpts: ScaffoldOpts): void {
  const LocaleData = LocaleManager.getInstance().getLocaleData();
  const addOnsList = buildAddOns(scaffoldOpts);

  const addOnsText = `
 ${chalk.underline(LocaleData.postScaffold.ADDONS_INSTALLED)}\n
 ${
   addOnsList.length
     ? addOnsList.map(
         (addOn, index) =>
           `${chalk.bold.greenBright(index + 1 + '. ' + addOn)}\n`
       )
     : chalk.dim(LocaleData.postScaffold.NO_ADDONS_INSTALLED)
 }
`;

  console.log(`
 ${chalk.bold(LocaleData.postScaffold.PROJECT_READY)}
  
 ${chalk.underline(LocaleData.postScaffold.PROJECT_SUMMARY)}\n
 ${LocaleData.postScaffold.labels.PROJECT_NAME}: ${chalk.greenBright.bold(
   scaffoldOpts.projectName
 )}
 ${LocaleData.postScaffold.labels.FRONTEND}: ${chalk.greenBright.bold(
   scaffoldOpts.frontend
 )}
 
 ${addOnsText}
  
 ${chalk.bold(LocaleData.postScaffold.headings.RUNNING_PROJECT)}\n
 1. ${LocaleData.postScaffold.instructions.NAV_TO_DIR}: ${chalk.greenBright(
   'cd ' + scaffoldOpts.projectName
 )}
 2. ${LocaleData.postScaffold.instructions.ACTIVATE_VENV}: ${chalk.greenBright(
   'pipenv shell'
 )}
 3. ${LocaleData.postScaffold.instructions.RUN_PROJECT}: ${chalk.greenBright(
   'npm run strm-dev'
 )}
 4. ${LocaleData.postScaffold.instructions.NAV_IN_BROWSER}: ${chalk.greenBright(
   'http://127.0.0.1:5000'
 )}
 
 Happy C🌀ding!
`);
}
