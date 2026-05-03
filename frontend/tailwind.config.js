/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        saffron: '#C8792A',
        gold: '#E8A93C',
        cream: '#FAF3E8',
        dark: '#1C1208',
        mid: '#4A3218',
        muted: '#8B6A3E',
        teal: '#1ABCA8',
        pink: '#E8436A',
        cultureGreen: '#2A7A4A',
        cultureRed: '#C0392B',
        cultureYellow: '#F2C94C',
        culturePurple: '#5E3A8A',
        cultureOlive: '#7A6C22',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        serif: ['Lora', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 45px rgba(200, 121, 42, 0.15)',
        panel: '0 18px 40px rgba(28, 18, 8, 0.08)',
      },
      opacity: {
        3: '0.03',
        14: '0.14',
        15: '0.15',
        16: '0.16',
        18: '0.18',
        22: '0.22',
        24: '0.24',
        35: '0.35',
        62: '0.62',
        65: '0.65',
        68: '0.68',
        72: '0.72',
        78: '0.78',
        82: '0.82',
        84: '0.84',
        85: '0.85',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1C1208',
            h2: {
              color: '#1C1208',
              fontFamily: '"Playfair Display", serif',
              fontWeight: '700',
              marginTop: '2rem',
              marginBottom: '1rem'
            },
            h3: {
              color: '#1C1208',
              fontFamily: '"Playfair Display", serif',
              fontWeight: '700',
              marginTop: '1.5rem',
              marginBottom: '0.75rem'
            },
            p: {
              marginBottom: '1rem',
              lineHeight: '1.75'
            },
            ul: {
              marginBottom: '1rem'
            },
            li: {
              marginBottom: '0.5rem',
              color: '#1A1208'
            },
            a: {
              color: '#C8792A',
              textDecoration: 'underline',
              '&:hover': {
                color: '#E8A93C'
              }
            },
            strong: {
              color: '#1C1208',
              fontWeight: '700'
            }
          }
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
