/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: 'var(--bg-dark)',
        cardBg: 'var(--bg-card)',
        textMain: 'var(--text-main)',
        textMuted: 'var(--text-muted)',
        brandPrimary: 'var(--primary)',
        brandPrimaryHover: 'var(--primary-hover)',
        income: 'var(--income)',
        expense: 'var(--expense)',
        borderDark: 'var(--border)'
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
