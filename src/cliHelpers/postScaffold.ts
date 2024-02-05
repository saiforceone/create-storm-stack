/**
 * @author SaiForceOne
 * @description Messaging shown when the scaffold process is completed
 */
// core & third-party imports
import chalk from 'chalk';

// ST🌀RM Stack Imports
import ScaffoldOpts = STORMStackCLI.ScaffoldOpts;
import { LocaleManager } from './localeManager.js';

/**
 * @function printScaffoldSummary
 * @param {ScaffoldOpts} scaffoldOpts
 * @description Prints out the scaffold summary based on the options selected during
 * the prompts
 */
export function printScaffoldSummary(scaffoldOpts: ScaffoldOpts): void {
  const LocaleData = LocaleManager.getInstance().getLocaleData();

  const cqAddonsText = `
 ${chalk.underline('Code Quality Addons')}\n
 ${
    scaffoldOpts.stormCQAddons.length ?
      scaffoldOpts.stormCQAddons.map((addon, index) => 
      `${chalk.bold.greenBright(index + 1 + '. ' + addon)}`
      ) : 'No code quality addons installed'
  }
`;

  const feAddonsText = `
 ${chalk.underline('Frontend Addons')}\n
 ${
    scaffoldOpts.stormFEAddons.length ?
      scaffoldOpts.stormFEAddons.map((addon, index) =>
      `${chalk.bold.greenBright(index + 1 + '. ' + addon)}`  
      ) : 'No frontend addon installed'
  }
`;

  const beAddonsText = `
 ${chalk.underline('Backend Addons')}\n
 ${
    scaffoldOpts.stormBEAddons.length ?
      scaffoldOpts.stormBEAddons.map((addon, index) =>
      `${index + 1 + '. ' + addon}`  
      ) : 'No backend addon installed'
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
 
 ${cqAddonsText}
 ${feAddonsText}
 ${beAddonsText}
  
 ${chalk.bold(LocaleData.postScaffold.headings.RUNNING_PROJECT)}\n
 1. ${LocaleData.postScaffold.instructions.NAV_TO_DIR}: ${chalk.greenBright(
   'cd ' + scaffoldOpts.projectName
 )}
 2. ${LocaleData.postScaffold.instructions.ACTIVATE_VENV}: ${chalk.greenBright(
   'pipenv shell'
 )}
 3. ${LocaleData.postScaffold.instructions.RUN_PROJECT}: ${chalk.greenBright(
   'npm run storm-dev'
 )}
 4. ${LocaleData.postScaffold.instructions.NAV_IN_BROWSER}: ${chalk.greenBright(
   'http://127.0.0.1:5000'
 )}
 
 Happy C🌀ding!
`);
}
