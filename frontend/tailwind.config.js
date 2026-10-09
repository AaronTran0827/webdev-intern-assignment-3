/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          light: 'var(--color-primary-light)',
          border: 'var(--color-primary-border)',
        },
        header: {
          bg: 'var(--color-header-bg)',
          text: 'var(--color-header-text)',
        },
        sidebar: {
          bg: 'var(--color-sidebar-bg)',
          border: 'var(--color-sidebar-border)',
          activeBg: 'var(--color-sidebar-active-bg)',
          activeText: 'var(--color-sidebar-active-text)',
        },
        app: {
          bg: 'var(--color-app-bg)',
        },
        card: {
          bg: 'var(--color-card-bg)',
          border: 'var(--color-card-border)',
        },
        txt: {
          main: 'var(--color-text-main)',
          muted: 'var(--color-text-muted)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
