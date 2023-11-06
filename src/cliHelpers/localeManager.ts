/**
 * @author SaiForceOne
 * @description singleton to make locale available to CLI
 */
// STRM-Stack Imports
import STRMLocaleData = STRMStackCLI.STRMLocaleData;

/**
 * @class LocaleManager
 * @description Represents a singleton that acts as a locale manager for the CLI
 * This provides a convenient way to load in localized strings to be presented
 * to the user.
 */
export class LocaleManager {
  private static instance: LocaleManager;
  private locale: string;
  private localeData: STRMLocaleData;

  // prevents accidental instantiation
  private constructor() {}

  public static getInstance(): LocaleManager {
    if (!LocaleManager.instance) {
      LocaleManager.instance = new LocaleManager();
    }
    return LocaleManager.instance;
  }

  // set locale?
  public setLocale(locale: string): void {
    this.locale = locale;
  }

  public getLocale(): string {
    return this.locale;
  }

  /**
   * @public
   * @param {STRMLocaleData} localeData
   * @description Given locale data, sets the singleton's locale data
   */
  public setLocaleData(localeData: STRMLocaleData) {
    this.localeData = localeData;
  }

  /**
   * @public
   * @returns {STRMLocaleData} locale data
   * @description Gets locale data so that it can be used throughout the CLI
   */
  public getLocaleData(): STRMLocaleData {
    return this.localeData;
  }
}
