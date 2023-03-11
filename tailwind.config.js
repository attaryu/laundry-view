/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'bouncing-1': '1.2s bouncing ease-in-out infinite',
        'bouncing-2': '1.2s bouncing 0.2s ease-in-out infinite',
        'bouncing-3': '1.2s bouncing 0.4s ease-in-out infinite',
      },
      keyframes: {
        bouncing: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
      },
    },
  },
  plugins: [],
};
