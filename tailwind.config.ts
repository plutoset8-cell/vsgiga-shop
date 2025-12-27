import type { Config } from 'tailwindcss'

const config: Config = {
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
    },
  },
  plugins: [],
}
export default config