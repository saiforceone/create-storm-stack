/**
 * @description Contains core STRM (STORM) Stack type definitions
 */
export namespace STRMApp {
  export type BaseAPIResponse = {
    success: boolean;
    message?: string;
    data: unknown;
  }
  export type APIStackComponent = {
    component: string;
  }
  export type StrmFERoute = {
    readonly path: string;
    readonly componentName: string;
    readonly componentPath: string;
  }
}
