let colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  content: [
    './index.{css,html,ts,tsx}',
    './{electron,public,src,void}/**/*.{css,html,js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gray: colors.zinc,
      },
    },
  },
  plugins: [],
}
