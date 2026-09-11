/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background-rgb) / <alpha-value>)',
        foreground: 'rgb(var(--foreground-rgb) / <alpha-value>)',
        surface: 'rgb(var(--surface-rgb) / <alpha-value>)',
        card: 'rgb(var(--card-rgb) / <alpha-value>)',
        elevated: 'rgb(var(--elevated-rgb) / <alpha-value>)',
        border: 'rgb(var(--border-rgb) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--primary-rgb) / <alpha-value>)',
          hover: 'rgb(var(--primary-hover-rgb) / <alpha-value>)',
          foreground: 'var(--primary-foreground)',
          dark: '#0097B2',
          light: '#00B8D9',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary-rgb) / <alpha-value>)',
          hover: 'rgb(var(--secondary-hover-rgb) / <alpha-value>)',
          dark: '#356FE6',
          light: '#4C8DFF',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted-rgb) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground-rgb) / <alpha-value>)',
        },
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        forza: {
          d: '#94A3B8',
          c: '#22C55E',
          b: '#3B82F6',
          a: '#8B5CF6',
          s1: '#F97316',
          s2: '#EF4444',
          x: '#EAB308',
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
