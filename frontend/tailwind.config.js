/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#113C3A',  // Hijau gelap baru
        'primary-light': '#22B2B0', // Tosca baru
        'accent': '#E8F6F6',        // Warna latar lembut baru
      },
      fontFamily: {
        // Menjadikan Poppins sebagai font bawaan seluruh aplikasi
        sans: ['Poppins', 'sans-serif'], 
      }
    },
  },
  plugins: [],
}