/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#0066cc',
        'primary-teal': '#00b4d8',
        'secondary-green': '#00c896',
        'highlight-yellow': '#ffd700',
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #0066cc 0%, #00b4d8 50%, #00c896 100%)',
        'gradient-button': 'linear-gradient(90deg, #0066cc 0%, #00c896 100%)',
        'gradient-blue': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-green': 'linear-gradient(135deg, #00c896 0%, #00d4aa 100%)',
        'gradient-purple': 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
        'gradient-orange': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      },
    },
  },
  plugins: [],
}