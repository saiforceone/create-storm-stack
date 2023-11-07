/**
 * @author SaiForceOne
 * @description STRM Stack type definitions
 */

declare namespace STRMStackCLI {
  // Standardized Scaffold output
  export type ScaffoldOutput = {
    success: boolean;
    message?: string;
  };

  // Frontend options for the STRM Stack CLI
  export type FrontendOpt = 'react' | 'vue' | 'lit';

  // ConsoleLogger mode
  export type LoggerMode = 'quiet' | 'verbose';

  // Log levels
  export type LogLevel = 'error' | 'info' | 'success' | 'warning';

  // Log message config that controls how the logs are displayed to console
  export type LogMessageConfigOpt = {
    color: string;
    label: string;
  };

  export type LogMessageConfiguration = Record<LogLevel, LogMessageConfigOpt>;

  // Scaffold options
  export type ScaffoldOpts = {
    projectName: string;
    frontend: FrontendOpt;
    loggerMode: LoggerMode;
    installPrettier: boolean;
  };

  // Structure for general STRM package files
  export type STRMPackageFile = {
    packages: Record<string, string>;
  };

  // structure of the package.json file
  export type STRMProjectPkgFile = {
    name: string;
    description: string;
    version: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    scripts: Record<string, string>;
    author: string;
  };

  export type STRMProjectScript = {
    name: string;
    command: string;
  };

  // Structure of config
  export type STRMConfigFile = {
    appId: string;
    viteHost: string;
    vitePort: string;
    frontend: FrontendOpt;
    frontendBasePath: string;
    frontendEntryPoint: string;
    frontendExtensions: string[];
    database: {
      dbms: string;
      path: string;
    };
  };

  // structure of the frontend dependencies file
  export type FrontendDependenciesFile = {
    common: Record<string, string>;
    frontendDeps: Record<FrontendOpt, Record<string, string>>;
  };

  export type FrontendOptData = {
    basePath: string;
    entryPoint: string;
    extensions: string[];
  };

  // frontend options file convenience type
  export type STRMFrontendOptFile = Record<FrontendOpt, FrontendOptData>;

  // STRM stack addon
  export type STRMAddOn = 'prettier' | 'eslint' | 'storybook' | 'vitetest';

  export type STRMAddOnsStructure = {
    packages: Record<string, string>;
  };

  export type STRMAddOnsFile = Record<STRMAddOn, STRMAddOnsStructure>;

  export type STRMBootOpts = {
    locale: string;
  };

  export type STRMStringsCategory = 'info' | 'warning' | 'success' | 'error';
  export type STRMLocaleData = {
    misc: {
      STORM_BRANDED: string;
      CHANGING_DIRECTORY: string;
      TAG_LINE: string;
    };
    cli: {
      PROJECT_DIR_INVALID: string;
      PROJECT_DIR_OK: string;
      PROMPT_PROJECT_NAME: string;
      PROMPT_FRONTEND_CHOICE: string;
      error: {
        INSTALL_ADDON: string;
      };
      info: {
        CHANGE_DIR: string;
        INSTALL_ADDON: string;
      };
      success: {
        INSTALL_ADDON: string;
      };
    };
    backend: {
      error: {
        PROJECT_DEST: string;
        PKG_FILE_LOAD_FAIL: string;
        CONFIG_FILE_LOAD_FAIL: string;
      };
      info: {
        COPY_BASE_TEMPLATE: string;
        COPY_CORE_FILES: string;
        COPY_SUPPORT_FILES: string;
        SET_UP_VIRTUAL_ENV: string;
      };
      success: {
        PROJECT_DEST: string;
        COPY_BASE_TEMPLATE: string;
        COPY_CORE_FILES: string;
        COPY_SUPPORT_FILES: string;
        FINISHED_VIRTUAL_ENV: string;
      };
    };
    postScaffold: {
      RUN_POST_PROCESSES: string;
    };
  };
}
