/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a',
        'primary-light': '#3b82f6',
        secondary: '#ffffff',
      },
      keyframes: {
        'slide-fade': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'slide-fade': 'slide-fade 0.6s ease-out',
        'fade-in': 'fade-in 1s ease-in',
      },
    },
  },
  plugins: [],
}

