/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aa-blue': '#00205B',
        'aa-red': '#CC092F',
        'aa-light-blue': '#0078D2',
        'aa-gray': '#5B616B',
        'aa-light-gray': '#E8E9EA',
      },
      fontFamily: {
        'sans': ['Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
