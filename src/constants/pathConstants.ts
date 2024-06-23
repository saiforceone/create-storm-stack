/**
 * @author SaiForceOne
 * @description Path constant definitions to be used throughout the CLI. These
 * constants are just path constants for convenience.
 */

export const PATH_CONSTANTS = {
  DIR_NAME_TEMPLATES: 'templates',
  DIR_NAME_CONFIGS: 'configs',
  DIR_NAME_SUPPORT: 'support',
  PATH_WEB_APP_CORE_TEMPLATE: `../../../templates/STORMAppCore`,
  PATH_WEB_BASE_TEMPLATE: '../../../templates/STORMBaseTemplates',
  PATH_STORM_SUPPORT_FILES: '../../../templates/STORMSupport',
  FILE_WEB_APP_CORE_DEPS: '../../../configs/webCoreDependencies.json',
  FILE_FRONTEND_CORE_DEPS: '../../../configs/viteBaseDependencies.json',
  FILE_FRONTEND_MAIN_DEPS: '../../../configs/frontendDependencies.json',
  PATH_STORM_ADDONS: '../../../templates/STORMAddOns',
  PATH_WEB_CORE_ADDONS: '../../../configs/webAddonDependencies.json',
  PATH_FRONTEND_TEMPLATES: '../../../templates/STORMFrontendTemplates',
  PATH_FRONTEND_SPECIFIC_ADDONS:
    '../../../configs/specificFEAddonDependencies.json',
  DIR_NAME_FE_CONFIG: 'storm_config',
  FILE_FE_APP_CONFIG: 'storm_config.json',
  FILE_PACKAGE_JSON: 'package.json',
  FILE_FRONTEND_CONFIGS: '../../../configs/frontendConfigOptions.json',
  FILE_ENV_EXAMPLE: '.env.example',
  FILE_ENV: '.env',
} as const;
