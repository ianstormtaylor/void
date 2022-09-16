module.exports = {
  mode: 'jit',
  content: [
    './index.{css,html,ts,tsx}',
    './{electron,public,src}/**/*.{css,html,js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
