
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: '#0f1419',
          card: '#1a222d',
          elevated: '#232d3b',
        },
        accent: {
          DEFAULT: '#34d399',
          muted: '#065f46',
        },
        danger: '#f87171',
        income: '#4ade80',
        expense: '#fb923c',
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(52, 211, 153, 0.35)',
      },
    },
  },
  plugins: [],
}
