/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'header': '20px 0 20px -25px  rgb(0 0 0 / 0.25)'
      },
      keyframes: {
        'wiggle': {
          '0%, 100%': {
            transform: 'rotate(-3deg)',
          },
          '50%': {
            transform: 'rotate(3deg)'
          },
          '10%': {
            transform: 'rotate(1deg)'
          },
          '20%': {
            transform: 'rotate(-1deg)'
          }
        }
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}