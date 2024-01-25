/**
 * @author SaiForceOne
 * @description STORM Stack type definitions
 */

declare namespace STORMStackCLI {
  // Standardized Scaffold output
  export type ScaffoldOutput = {
    success: boolean;
    message?: string;
  };

  // Frontend options for the STORM Stack CLI
  export type FrontendOpt = 'react' | 'vue';

  // Frontend Entrypoint Option for the STORM Stack CLI
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
    stormAddons: STORMAddOn[];
    enableGit: boolean;
  };

  // Structure for general STORM package files
  export type STORMPackageFile = {
    packages: Record<string, string>;
  };

  // structure of the package.json file
  export type STORMProjectPkgFile = {
    name: string;
    description: string;
    version: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    scripts: Record<string, string>;
    author: string;
  };

  export type STORMProjectScript = {
    name: string;
    command: string;
  };

  // Structure of config
  export type STORMConfigFile = {
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
  export type STORMFrontendOptFile = Record<FrontendOpt, FrontendOptData>;

  // STORM stack addon
  export type STORMAddOn = 'prettier' | 'eslint' | 'storybook' | 'vitetest' | 'sentry';

  export type STORMAddOnsStructure = {
    packages: Record<string, string>;
  };

  export type STORMAddOnsFile = Record<STORMAddOn, STORMAddOnsStructure>;

  export type STORMBootOpts = {
    locale: string;
  };

  type STORMStandardFEMsgs = {
    COPY_FE_TEMPLATES: string;
    COPY_FE_RESOURCES: string;
    INSTALL_BASE_VITE_DEPS: string;
    INSTALL_FE_ADDON: string;
    INSTALL_FE_DEPS: string;
    UPDATE_PROJECT_CONFIG: string;
    UPDATE_PROJECT_PKG_FILE: string;
    UPDATE_PKG_SCRIPTS: string;
  };

  // ST🌀RM Stack Adv CLI messages
  type STORMAdvCliMsgs = {
    BUILD_FRONTEND_COMPONENTS: string;
    CHECK_SYSTEM_DEPENDENCIES: string;
    CREATE_CONTROLLER: string;
    CREATE_FE_COMPONENT: string;
    CREATE_MODEL: string;
    LOAD_STORM_CONFIG: string;
    LOAD_STORM_MODULES: string;
    MODULE_CREATE: string;
    REWRITE_MODULE_ROUTES: string;
    UPDATE_AUTO_IMPORTS: string;
    WRITE_STORM_MODULES: string;
  };

  export type STORMLocaleData = {
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
        MAKE_MODULE_CMD: string;
        MODULE_NAME: string;
        MODULE_PLURAL: string;
        CONTROLLER_ONLY: string;
        CHECK_SYSTEM_DEPS: string;
      };
      responses: {
        PROJECT_APPEARS_VALID: string;
        PROJECT_APPEARS_INVALID: string;
        INVALID_MODULE_NAME: string;
        INVALID_STORM_MODULE: string;
        MODULE_CREATED: string;
        MODULE_NOT_CREATED: string;
        MODULE_ALREADY_EXISTS: string;
      };
      info: STORMAdvCliMsgs;
      error: STORMAdvCliMsgs;
      success: STORMAdvCliMsgs;
    };
    cli: {
      PROJECT_DIR_INVALID: string;
      PROJECT_DIR_OK: string;
      prompts: {
        PROJECT_NAME: string;
        FRONTEND_CHOICE: string;
        LOGGING_MODE: string;
        INSTALL_ADDON: string;
        ENABLE_OPTION: string;
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
      error: STORMStandardFEMsgs;
      info: STORMStandardFEMsgs;
      success: STORMStandardFEMsgs;
    };
    backend: {
      error: {
        PROJECT_DEST: string;
        PKG_FILE_LOAD_FAIL: string;
        CONFIG_FILE_LOAD_FAIL: string;
        INSTALL_BASE_DEPS: string;
        ENABLE_GIT: string;
      };
      info: {
        COPY_BASE_TEMPLATE: string;
        COPY_CORE_FILES: string;
        COPY_SUPPORT_FILES: string;
        INSTALL_BASE_DEPS: string;
        SET_UP_VIRTUAL_ENV: string;
        ENABLE_GIT: string;
      };
      success: {
        PROJECT_DEST: string;
        COPY_BASE_TEMPLATE: string;
        COPY_CORE_FILES: string;
        COPY_SUPPORT_FILES: string;
        INSTALL_BASE_DEPS: string;
        FINISHED_VIRTUAL_ENV: string;
        ENABLE_GIT: string;
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

  // STORM Frontend Route - Framework agnostic route representation
  export type STORMFERoute = {
    readonly path: string;
    readonly componentName: string;
    readonly componentPath: string;
  };

  export type STORMController = {
    controllerName: string;
    endpointBase: string;
    modelName: string;
  };

  // STORM Module - Collection of a controller, model and frontend pages
  export type STORMModule = {
    controller: STORMController;
    controllerOnly: boolean;
    pages: Array<STORMFERoute>;
  };

  // STORM Modules File - A JSON file that represents a STORM Stack module collection
  export type STORMModulesFile = {
    appId: string;
    lastUpdated: string;
    modules: Record<string, STORMModule>;
  };

  // STORM Module Arguments - Command line arguments helper for creating modules
  export type STORMModuleArgs = {
    /* The name of the module */
    name: string;
    /* Should the module have backend components only (no page components) */
    controllerOnly?: boolean;
    /* Specifies the pluralization of a module name. This is optional */
    plural?: string;
  };

  /**
   * STORM command execution status - to be used as part of the scaffold start up process
   * and represents the command execution status.
   */
  export type STORMCommandExecStatus = {
    label: string;
    command: string;
    details?: string;
    success: boolean;
    required: boolean;
  };

  export type STORMCLIProcessMsgArgs = {
    message: string;
    detail?: string;
  };
}
