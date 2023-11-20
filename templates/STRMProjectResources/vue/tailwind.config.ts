/**
 * @description Base tailwind css configuration to get you up and running
 * Feel free to extend the theme, add plugins or configure as needed.
 * */
import type { Config } from 'tailwindcss';

export default {
  content: ['./templates/*.html', './strm_fe_vue/src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        'strm-bg-dark': '#050a15',
        'strm-bg-lighter': '#4C74B6',
      },
      fontFamily: {
        heading: ['Jura', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
