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
        'livada-green': '#4CAF50',
        'livada-dark': '#2c3e50',
        'livada-light': '#ecf0f1',
      },
    },
  },
  plugins: [],
}
