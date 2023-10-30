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
}
