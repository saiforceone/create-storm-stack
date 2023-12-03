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

  // Frontend Entrypoint Option for the STRM Stack CLI
  export type FrontendEntryPointOpt = 'main.ts' | 'main.tsx';

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
    vitePort: number;
    frontend: FrontendOpt;
    frontendBasePath: string;
    frontendEntryPoint: FrontendEntryPointOpt;
    frontendExtensions: string[];
  };

  // structure of the frontend dependencies file
  export type FrontendDependenciesFile = {
    common: Record<string, string>;
    frontendDeps: Record<FrontendOpt, Record<string, string>>;
  };

  export type FrontendOptData = {
    basePath: string;
    entryPoint: FrontendEntryPointOpt;
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

  type STRMStandardFEMsgs = {
    COPY_FE_TEMPLATES: string;
    COPY_FE_RESOURCES: string;
    INSTALL_BASE_VITE_DEPS: string;
    INSTALL_FE_ADDON: string;
    INSTALL_FE_DEPS: string;
    UPDATE_PROJECT_CONFIG: string;
    UPDATE_PROJECT_PKG_FILE: string;
    UPDATE_PKG_SCRIPTS: string;
  };

  export type STRMLocaleData = {
    misc: {
      STORM_BRANDED: string;
      CHANGING_DIRECTORY: string;
      TAG_LINE: string;
    };
    advCli: {
      headings: {
        ADV_CLI: string;
      };
      labels: {
        VERSION: string;
      };
      descriptions: {
        PROGRAM: string;
        INFO_CMD: string;
      };
      responses: {
        PROJECT_APPEARS_VALID: string;
        PROJECT_APPEARS_INVALID: string;
      };
    };
    cli: {
      PROJECT_DIR_INVALID: string;
      PROJECT_DIR_OK: string;
      prompts: {
        PROJECT_NAME: string;
        FRONTEND_CHOICE: string;
        LOGGING_MODE: string;
        INSTALL_ADDON: string;
      };
      error: {
        INSTALL_ADDON: string;
        LOAD_CONFIG_FILE: string;
        WRITE_ENV_DATA: string;
      };
      info: {
        CHANGE_DIR: string;
        INSTALL_ADDON: string;
        LOAD_CONFIG_FILE: string;
        WRITE_ENV_DATA: string;
      };
      success: {
        INSTALL_ADDON: string;
        LOAD_CONFIG_FILE: string;
        WRITE_ENV_DATA: string;
      };
    };
    frontend: {
      error: STRMStandardFEMsgs;
      info: STRMStandardFEMsgs;
      success: STRMStandardFEMsgs;
    };
    backend: {
      error: {
        PROJECT_DEST: string;
        PKG_FILE_LOAD_FAIL: string;
        CONFIG_FILE_LOAD_FAIL: string;
        INSTALL_BASE_DEPS: string;
      };
      info: {
        COPY_BASE_TEMPLATE: string;
        COPY_CORE_FILES: string;
        COPY_SUPPORT_FILES: string;
        INSTALL_BASE_DEPS: string;
        SET_UP_VIRTUAL_ENV: string;
      };
      success: {
        PROJECT_DEST: string;
        COPY_BASE_TEMPLATE: string;
        COPY_CORE_FILES: string;
        COPY_SUPPORT_FILES: string;
        INSTALL_BASE_DEPS: string;
        FINISHED_VIRTUAL_ENV: string;
      };
    };
    postScaffold: {
      ADDONS_INSTALLED: string;
      NO_ADDONS_INSTALLED: string;
      RUN_POST_PROCESSES: string;
      PROJECT_READY: string;
      PROJECT_SUMMARY: string;
      headings: {
        ADDONS_INSTALLED: string;
        PROJECT_SUMMARY: string;
        RUNNING_PROJECT: string;
      };
      instructions: {
        ACTIVATE_VENV: string;
        NAV_IN_BROWSER: string;
        NAV_TO_DIR: string;
        RUN_PROJECT: string;
      };
      labels: {
        PROJECT_NAME: string;
        FRONTEND: string;
      };
    };
  };

  // STRM Frontend Route - Framework agnostic route representation
  export type STRMFERoute = {
    readonly path: string;
    readonly componentName: string;
    readonly componentPath: string;
  };

  // STRM Module - Collection of a controller, model and frontend pages
  export type STRMModule = {
    controller?: {
      controllerName: string;
      endpointBase: string;
      modelName: string;
    };
    pageOnly: boolean;
    pages: Array<STRMFERoute>;
  };

  // STRM Modules File - A JSON file that represents a STRM Stack module collection
  export type STRMModulesFile = {
    appId: string;
    resource: string;
    lastUpdated: string;
    modules: Record<string, STRMModule>;
  };

  export type STRMModuleArgs = {
    name: string;
    indexOnly?: boolean;
  };
}
