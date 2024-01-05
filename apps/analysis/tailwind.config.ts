import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      gridTemplateColumns: {
        'trend-chart': 'repeat(3, 25rem)',
      },
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
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
