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
          DEFAULT: 'rgb(var(--color-primary))',
          light: 'rgb(var(--color-primary-light))',
          lightest: 'rgb(var(--color-primary-lightest))',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary))',
          light: 'rgb(var(--color-secondary-light))',
        },
        destructive: {
          DEFAULT: 'rgb(var(--color-destructive))',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent))',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted))',
        },
        popover: {
          DEFAULT: 'rgb(var(--popover))',
        },
        card: {
          DEFAULT: 'rgb(var(--card))',
        },
        background: 'rgb(var(--background))',
        black: 'rgb(var(--color-black))',
        overlay: 'rgb(var(--color-overlay))',
        input: 'rgb(var(--input))',
        border: 'rgb(var(--border))',
        ring: 'rgb(var(--ring))',
        placeholder: 'rgb(var(--placeholder))',
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
  plugins: [],
};
