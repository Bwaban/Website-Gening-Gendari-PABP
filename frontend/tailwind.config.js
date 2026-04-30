/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        saffron: '#C8792A',
        gold: '#D4A843',
        cream: '#FDF6E3',
        dark: '#1A1208',
        cultureGreen: '#2A7A4A',
        cultureRed: '#C0392B',
        cultureYellow: '#D4AC0D',
        culturePurple: '#5E3A8A',
        cultureOlive: '#7A6C22',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Lora', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 45px rgba(26, 18, 8, 0.12)',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1A1208',
            h2: {
              color: '#1A1208',
              fontFamily: '"Playfair Display", serif',
              fontWeight: '700',
              marginTop: '2rem',
              marginBottom: '1rem'
            },
            h3: {
              color: '#1A1208',
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
                color: '#D4A843'
              }
            },
            strong: {
              color: '#1A1208',
              fontWeight: '700'
            }
          }
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
