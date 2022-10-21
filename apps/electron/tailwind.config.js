let colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  content: ['./{src,public,resources}/**/*.{css,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: colors.zinc,
      },
    },
  },
}
