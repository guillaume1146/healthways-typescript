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
        'primary-blue': '#125ff9',
        'primary-teal': '#008fa3', 
        'secondary-green': '#00a542',
        'highlight-yellow': '#ffd700',
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #125ff9 0%, #008fa3 50%, #00a542 100%)',
        'gradient-hero': 'linear-gradient(135deg, #125ff9 0%, #125ff9 30%, #008fa3 70%, #00a542 100%)',
        'gradient-button': 'linear-gradient(90deg, #125ff9 0%, #00a542 100%)',
        'gradient-blue': 'linear-gradient(135deg, #125ff9 0%, #008fa3 100%)',
        'gradient-green': 'linear-gradient(135deg, #00a542 0%, #008fa3 100%)',
        'gradient-purple': 'linear-gradient(135deg, #008fa3 0%, #125ff9 100%)',
        'gradient-orange': 'linear-gradient(135deg, #00a542 0%, #125ff9 100%)',
        'gradient-footer': 'linear-gradient(135deg, #125ff9 0%, #125ff9 30%, #008fa3 70%, #00a542 100%)',
      },
    },
  },
  plugins: [],
}