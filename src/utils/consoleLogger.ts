/**
 * @author SaiForceOne
 * @description ConsoleLogger function that prints formatted logs
 */

// Core & third-party imports
import chalk, { ForegroundColorName } from 'chalk';

// FTL Imports
import LogLevel = FTLStackCLI.LogLevel;
import LogMessageConfiguration = FTLStackCLI.LogMessageConfiguration;
import LogMessageConfigOpt = FTLStackCLI.LogMessageConfigOpt;

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
}
