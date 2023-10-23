/**
 * @author SaiForceOne
 * @description Base tailwindcss config file that should get you up and running.
 * Feel free to edit this to better suite your needs
 * */
import type { Config } from 'tailwindcss';

export default {
  content: [
    // base
    './templates/*.html',
    // react
    './strm_fe_react/src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Rowdies', 'cursive'],
      },
    },
  },
  plugins: [],
} satisfies Config;
