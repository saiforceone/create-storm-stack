/**
 * @description Contains core STORM Stack type definitions
 */
export namespace STORMApp {
  export type BaseAPIResponse = {
    success: boolean;
    message?: string;
    data: unknown;
  };

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

  // ST🌀RM Module - Collection of a controller, model and frontend pages
  export type STORMModule = {
    controller: STORMController;
    controllerOnly: boolean;
    pages: Array<STORMFERoute>;
  };

  // ST🌀RM Modules File - A JSON file that represents a ST🌀RM Stack module collection
  export type STORMModulesFile = {
    appId: string;
    lastUpdated: string;
    modules: Record<string, STORMModule>;
  };
}
