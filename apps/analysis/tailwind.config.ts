import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    container: {
      screens: {
        '2xl': '1600px',
      },
    },
    extend: {
      colors: {
        primary: '#FC8D26',
        'primary-light': '#E1C3A0',
        'primary-light2': '#FCE2B9',
        'brand-gray': '#4D4D4D',
        background: {
          light: '#FFFAF6',
          dark: '#37332A',
        },

        // sidebar: {
        //     light: {
        //         inactive: '#E1C3A0',
        //         active: '#FC8D26',
        //         bg: {
        //             from: 'rgba(255, 241, 219, 0.25)',
        //             to: '#F9EBD5',
        //         },
        //     },
        //     dark: {
        //         inactive: '#B28249',
        //         active: '#995414',
        //         bg: {
        //             from: 'rgba(108, 69, 12, 0.25)',
        //             to: '#7F5A20',
        //         },
        //     },
        // },
      },
      fontFamily: {
        sans: ['Neue Machina', ...fontFamily.sans],
        sora: ['Sora', 'sans'],
      },
      animation: {
        slide: 'slideIn 5s liner',
      },
      keyFrames: {
        slidesIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
