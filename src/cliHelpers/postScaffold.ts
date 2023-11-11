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
     : 'No add-ons were installed'
 }
`;

  console.log(`
 ${chalk.bold(LocaleData.postScaffold.PROJECT_READY)}
  
 ${chalk.underline(LocaleData.postScaffold.PROJECT_SUMMARY)}\n
 Project Name: ${chalk.greenBright.bold(scaffoldOpts.projectName)}
 Frontend: ${chalk.greenBright.bold(scaffoldOpts.frontend)}
 
 ${addOnsText}
  
 ${chalk.bold(`Running your ${LocaleData.misc.STORM_BRANDED} project`)}\n
 1. Navigate to the directory: ${chalk.greenBright(
   'cd ' + scaffoldOpts.projectName
 )}
 2. Activate the virtual environment: ${chalk.greenBright('pipenv shell')}
 3. Run the project: ${chalk.greenBright('npm run strm-dev')}
 4. In your browser, navigate to: ${chalk.greenBright('http://127.0.0.1:5000')}
 
 Happy C🌀ding!
`);
}
