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
    },
  },
  plugins: [],
}
