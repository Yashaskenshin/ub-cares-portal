/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ub-gold': '#FDB913',
        'ub-dark': '#1a1a1a',
        'ub-blue': '#003DA5',
      }
    },
  },
  plugins: [],
}

