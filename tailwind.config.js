/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        'serif': ['var(--font-playfair)', 'Playfair Display', 'serif'],
        'inter': ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        'playfair': ['var(--font-playfair)', 'Playfair Display', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: 'var(--font-inter)',
            h1: {
              fontFamily: 'var(--font-playfair)',
              fontWeight: '600',
            },
            h2: {
              fontFamily: 'var(--font-playfair)',
              fontWeight: '600',
            },
            h3: {
              fontFamily: 'var(--font-playfair)',
              fontWeight: '600',
            },
            h4: {
              fontFamily: 'var(--font-playfair)',
              fontWeight: '600',
            },
          },
        },
      },
    },
  },
  plugins: [],
}
