/**
 * @author SaiForceOne
 * @description Messaging shown when the scaffold process is completed
 */
// core & third-party imports
import chalk from 'chalk';

// ST🌀RM Stack Imports
import ScaffoldOpts = STORMStackCLI.ScaffoldOpts;
import { LocaleManager } from './localeManager.js';
import {getFrontendEntrypoint} from "../utils/scaffoldUtils.js";

/**
 * @function printScaffoldSummary
 * @param {ScaffoldOpts} scaffoldOpts
 * @description Prints out the scaffold summary based on the options selected during
 * the prompts
 */
export function printScaffoldSummary(scaffoldOpts: ScaffoldOpts): void {
  const LocaleData = LocaleManager.getInstance().getLocaleData();

  const cqAddonsText = `
 ${chalk.underline(LocaleData.postScaffold.headings.CODE_QUALITY_ADDONS_INSTALLED)}\n
 ${
    scaffoldOpts.stormCQAddons.length ?
      scaffoldOpts.stormCQAddons.map((addon, index) => 
      `${chalk.bold.greenBright(index + 1 + '. ' + addon)}`
      ) : 'N/A'
  }
`;

  const feAddonsText = `
 ${chalk.underline(LocaleData.postScaffold.headings.FRONTEND_ADDONS_INSTALLED)}\n
 ${
    scaffoldOpts.stormFEAddons.length ?
      scaffoldOpts.stormFEAddons.map((addon, index) =>
      `${chalk.bold.greenBright(index + 1 + '. ' + addon)}`  
      ) : 'N/A'
  }
`;

  const beAddonsText = `
 ${chalk.underline(LocaleData.postScaffold.headings.BACKEND_INSTRUCTIONS)}\n
 ${
    scaffoldOpts.stormBEAddons.length ?
      scaffoldOpts.stormBEAddons.map((addon, index) =>
      `${chalk.bold.greenBright(index + 1 + '. ' + addon)}`  
      ) : 'N/A'
  }
`;

  let sentryInstructions = ``;

  if (scaffoldOpts.stormBEAddons.includes('sentry')) {
    sentryInstructions += `
 ${chalk.underline(`${LocaleData.postScaffold.headings.BACKEND_INSTRUCTIONS}: Sentry`)}\n
 To use Sentry with your application, you will need to add your DSN to your ${chalk.dim('.env')} file\n
`
  }

  if (scaffoldOpts.stormFEAddons.includes('sentry')) {
    sentryInstructions += `
 ${chalk.underline(`${LocaleData.postScaffold.headings.FRONTEND_INSTRUCTIONS}: Sentry`)}\n
 To use Sentry with your (${scaffoldOpts.frontend}) application, uncomment the marked code in the following files
 ${chalk.dim(`${getFrontendEntrypoint(scaffoldOpts.frontend)}`)} and provide an appropriate ${chalk.dim('DSN')}.
`;
  }

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
 
 ${sentryInstructions}
 
 Happy C🌀ding!
`);
}
