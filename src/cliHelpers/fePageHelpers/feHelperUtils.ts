/**
 * @author SaiForceOne
 * @description A collection of frontend page helper utility functions
 */

// ST🌀RM Stack Imports
import FrontendOpt = STORMStackCLI.FrontendOpt;

/**
 * @function getStandardImports
 * @description
 * @param {FrontendOpt} frontendOpt
 * @return string
 */
export function getStandardImports(frontendOpt: FrontendOpt): string {
  const STANDARD_IMPORTS: Record<FrontendOpt, string> = {
    vue: "import { defineComponent } from 'vue';",
    react: "import React from 'react';",
  };

  return STANDARD_IMPORTS[frontendOpt];
}
