/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      colors: {
        navy: '#1a2c6b',
        primary: {
          50:  '#eef2ff',
          100: '#e0e8ff',
          200: '#c4d2ff',
          300: '#9eb5ff',
          400: '#708df2',
          500: '#4c67d8',
          600: '#1a2c6b',
          700: '#142255',
          800: '#0f1a43',
          900: '#0b1333',
          950: '#070d24',
        },
      },
      boxShadow: {
        'soft':    '0 2px 15px -3px rgba(0,0,0,.07), 0 10px 20px -2px rgba(0,0,0,.04)',
        'soft-lg': '0 4px 25px -5px rgba(0,0,0,.1),  0 10px 30px -5px rgba(0,0,0,.05)',
        'card':    '0 1px 3px rgba(0,0,0,.05), 0 4px 12px rgba(0,0,0,.05)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      animation: {
        'fade-in':   'fadeIn .4s ease-in-out',
        'slide-up':  'slideUp .4s ease-out',
        'pulse-soft':'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: .7 } },
      },
    },
  },
  plugins: [],
}
