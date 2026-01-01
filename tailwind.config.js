/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        primary: { DEFAULT: '#d67a9d', foreground: '#ffffff' },
        secondary: { DEFAULT: '#71b3c9', foreground: '#ffffff' },
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 6s ease infinite',
        'slide': 'slide 3s linear infinite',
        'slideDown': 'slideDown 0.5s ease-out',
      },
      backdropBlur: {
        '3xl': '64px',
      },
      zIndex: {
        'negative': '-1',
        'background': '-10',
      }
    },
  },
  plugins: [],
}