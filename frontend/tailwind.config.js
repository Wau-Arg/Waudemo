/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta de WAU
        primary: {
          50:  '#fef9ee',
          100: '#fdf0d0',
          200: '#fada9e',
          300: '#f7c162',
          400: '#f4a42f',
          500: '#f18c11',
          600: '#e5700a',
          700: '#be520c',
          800: '#974011',
          900: '#7a3611',
        },
        secondary: {
          500: '#6366f1',
          600: '#4f46e5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
