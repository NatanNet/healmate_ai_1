/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#0E3B3A',
        'primary-light': '#20A4A0',
        'accent': '#22D1D1',
      },
    },
  },
  plugins: [],
}
