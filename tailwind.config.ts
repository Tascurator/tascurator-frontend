/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgba(var(--color-primary), <alpha-value>)',
          light: 'rgba(var(--color-primary-light), <alpha-value>)',
          lightest: 'rgba(var(--color-primary-lightest), <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgba(var(--color-secondary), <alpha-value>)',
          light: 'rgba(var(--color-secondary-light), <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'rgba(var(--color-destructive), <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgba(var(--color-accent), <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgba(var(--muted), <alpha-value>)',
        },
        popover: {
          DEFAULT: 'rgba(var(--popover), <alpha-value>)',
        },
        card: {
          DEFAULT: 'rgba(var(--card), <alpha-value>)',
        },
        background: 'rgba(var(--background), <alpha-value>)',
        black: 'rgba(var(--color-black), <alpha-value>)',
        overlay: 'rgba(var(--color-overlay))',
        input: 'rgba(var(--input), <alpha-value>)',
        border: 'rgba(var(--border), <alpha-value>)',
        ring: 'rgba(var(--ring), <alpha-value>)',
        placeholder: 'rgba(var(--placeholder), <alpha-value>)',
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
};
