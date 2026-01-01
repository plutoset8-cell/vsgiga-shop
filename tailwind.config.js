/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 6s ease infinite', // ДОБАВИТЬ
        'slide': 'slide 3s linear infinite', // ДОБАВИТЬ
        'slideDown': 'slideDown 0.5s ease-out', // ДОБАВИТЬ
      },
      backdropBlur: {
        '3xl': '64px',
      },
      zIndex: {
        'negative': '-1', // ДОБАВИТЬ для фона
        'background': '-10', // ДОБАВИТЬ
      }
    },
  },
  plugins: [],
}