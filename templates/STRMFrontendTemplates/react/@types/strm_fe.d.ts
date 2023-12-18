/**
 * @description Contains core STRM (STORM) Stack type definitions
 */
export namespace STRMApp {
  export type BaseAPIResponse = {
    success: boolean;
    message?: string;
    data: unknown;
  };

  export type StrmFERoute = {
    readonly path: string;
    readonly componentName: string;
    readonly componentPath: string;
  };

  export type STRMFERoute = {
    readonly path: string;
    readonly componentName: string;
    readonly componentPath: string;
  };

  export type STRMController = {
    controllerName: string;
    endpointBase: string;
    modelName: string;
  };

  // STRM Module - Collection of a controller, model and frontend pages
  export type STRMModule = {
    controller: STRMController;
    controllerOnly: boolean;
    pages: Array<STRMFERoute>;
  };

  // STRM Modules File - A JSON file that represents a STRM Stack module collection
  export type STRMModulesFile = {
    appId: string;
    lastUpdated: string;
    modules: Record<string, STRMModule>;
  };
}
