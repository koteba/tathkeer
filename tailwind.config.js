/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Amiri', 'serif'],
        body: ['Tajawal', 'sans-serif'],
      },
      colors: {
        night: {
          DEFAULT: '#0E1B2E',
          soft: '#16283F',
          deep: '#0A1422',
        },
        parchment: {
          DEFAULT: '#FBF5E9',
          soft: '#F3E9D2',
        },
        gold: {
          DEFAULT: '#C6A15B',
          bright: '#D9B968',
          deep: '#9C7B3C',
        },
        ink: {
          DEFAULT: '#1E2A3D',
          light: '#F2E8D5',
        },
      },
      keyframes: {
        pulseTap: {
          '0%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(0.94)' },
          '100%': { transform: 'scale(1)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        pulseTap: 'pulseTap 0.28s ease-out',
        glow: 'glow 2.4s ease-in-out infinite',
        fadeUp: 'fadeUp 0.4s ease-out',
      },
    },
  },
  plugins: [],
}
