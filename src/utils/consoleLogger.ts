/**
 * @author SaiForceOne
 * @description ConsoleLogger function that prints formatted logs
 */

// Core & third-party imports
import chalk, { ForegroundColorName } from 'chalk';

// ST🌀RM Imports
import LogLevel = STORMStackCLI.LogLevel;
import LogMessageConfiguration = STORMStackCLI.LogMessageConfiguration;
import LogMessageConfigOpt = STORMStackCLI.LogMessageConfigOpt;
import STORMCLIProcessMsgArgs = STORMStackCLI.STORMCLIProcessMsgArgs;

const LOG_CONFIGURATION: LogMessageConfiguration = {
  error: {
    label: 'damn',
    color: 'redBright',
  },
  info: {
    label: 'okay',
    color: 'blue',
  },
  warning: {
    label: 'ouch',
    color: 'yellow',
  },
  success: {
    label: 'cool',
    color: 'green',
  },
};

/**
 * @description convenience function that gets log message configuration
 * @param logLevel
 */
function getMessageConfiguration(logLevel: LogLevel): LogMessageConfigOpt {
  return LOG_CONFIGURATION[logLevel] || LOG_CONFIGURATION['info'];
}

/**
 * @description 'Class' definition for logger utility
 */
export class ConsoleLogger {
  /**
   * @description Prints a message to the console, with the appropriate styling
   * @param {string} message
   * @param {LogLevel} logLevel
   */
  static printLog(message: string, logLevel: LogLevel = 'info'): void {
    const logConfig = getMessageConfiguration(logLevel);
    const colorName = logConfig.color as ForegroundColorName;
    console.log(`${chalk[colorName].bold(`[${logConfig.label}]: ${message}`)}`);
  }

  static printCLIProcessErrorMessage(message: string, detail?: string): void {
    let output = `⛔ ${chalk.redBright.bold(message)}`;
    if (detail) output += `: ${chalk.italic(detail)}`;
    console.log(output);
  }

  static printCLIProcessInfoMessage(message: string, detail?: string): void {
    let output = `ℹ️  ${chalk.dim.bold(message)}`;
    if (detail) output += `: ${chalk.italic(detail)}`;
    console.log(output);
  }

  /**
   * @function printCLIProcessWarningMessage
   * @description Prints a warning message with optional detail
   * @param message
   * @param detail
   */
  static printCLIProcessWarningMessage({
    message,
    detail,
  }: STORMCLIProcessMsgArgs): void {
    let output = `⚠️  ${chalk.yellowBright.bold(message)}`;
    if (detail) output += `: ${chalk.italic(detail)}`;
    console.log(output);
  }

  /**
   * @function printCLIProcessSuccessMessage
   * @description Prints a success message with optional detail
   * @param {string} message
   * @param detail additional information to print out
   */
  static printCLIProcessSuccessMessage({
    message,
    detail,
  }: STORMCLIProcessMsgArgs): void {
    let output = `✅ ${chalk.greenBright.bold(message)}`;
    if (detail) {
      output += `: ${chalk.italic(detail)}`;
    }
    console.log(output);
  }
}
