/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'duck-yellow': '#FFD700',
        'duck-yellow-light': '#FFF8DC',
        'duck-yellow-dark': '#FFC700',
        'pond-blue': '#4A90E2',
        'pond-blue-dark': '#2E5C8A',
        'pond-blue-light': '#B8D4F8',
        'soft-white': '#F8F9FA',
        'vibrant-orange': '#FF8C42',
        red: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          300: '#FCA5A5',
          500: '#EF4444',
          600: '#DC2626',
        },
        gray: {
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
        },
      },

      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
        fredoka: ['Fredoka', 'sans-serif'],
        baloo2: ['"Baloo 2"', 'cursive'],
        fresca: ['Fresca', 'cursive'],
      },

      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
        '5xl': '48px',
      },

      borderRadius: {
        none: '0',
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        full: '9999px',
      },
    },
  },
  plugins: [],
};

console.log("success")
