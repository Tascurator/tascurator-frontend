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
    },
  },
  plugins: [],
};
