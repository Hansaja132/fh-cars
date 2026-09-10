/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#e63946',
          dark: '#c1121f',
          light: '#ff4d5a',
        },
        accent: {
          DEFAULT: '#f77f00',
          yellow: '#fcbf49',
          blue: '#0077b6',
        },
        card: {
          DEFAULT: 'rgba(18, 22, 31, 0.8)',
          light: '#ffffff',
        },
        forza: {
          d: '#4a90e2',
          c: '#2ecc71',
          b: '#f39c12',
          a: '#e67e22',
          s1: '#e74c3c',
          s2: '#9b59b6',
          x: '#34495e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
