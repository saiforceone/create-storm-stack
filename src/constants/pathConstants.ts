/**
 * @author SaiForceOne
 * @description Path constant definitions to be used throughout the CLI. These
 * constants are just path constants for convenience.
 */

export const PATH_CONSTANTS = {
  DIR_NAME_TEMPLATES: 'templates',
  DIR_NAME_CONFIGS: 'configs',
  DIR_NAME_SUPPORT: 'support',
  PATH_WEB_APP_CORE_TEMPLATE: `../../../templates/STRMAppCore`,
  PATH_WEB_BASE_TEMPLATE: '../../../templates/STRMBaseTemplates',
  PATH_VITE_HMR_TAGS: '../../../templates/STRMHmr',
  FILE_WEB_APP_CORE_DEPS: '../../../configs/webCoreDependencies.json',
  FILE_FRONTEND_CORE_DEPS: '../../../configs/viteBaseDependencies.json',
  FILE_FRONTEND_MAIN_DEPS: '../../../configs/frontendDependencies.json',
  PATH_FRONTEND_TEMPLATES: '../../../templates/STRMFrontendTemplates',
  DIR_NAME_FE_CONFIG: 'strm_config',
  FILE_FE_APP_CONFIG: 'strm_config.json',
  FILE_PACKAGE_JSON: 'package.json',
  FILE_FRONTEND_CONFIGS: '../../../configs/frontendConfigOptions.json',
} as const;
