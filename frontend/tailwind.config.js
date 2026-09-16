/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F2FF',
          100: '#CCE5FF',
          200: '#99CCFF',
          300: '#66B2FF',
          400: '#3399FF',
          500: '#0066CC',
          600: '#0052A3',
          700: '#003D7A',
          800: '#002952',
          900: '#001429'
        },
        secondary: {
          50: '#E6F9F2',
          100: '#CCF3E6',
          200: '#99E7CC',
          300: '#66DBB3',
          400: '#33CF99',
          500: '#00A86B',
          600: '#008656',
          700: '#006540',
          800: '#00432B',
          900: '#002215'
        }
      }
    },
  },
  plugins: [],
}
