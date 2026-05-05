export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FDFBF7',
        lime: '#CCFF00',
        violet: '#5B4B8A',
        ink: '#1A1A1A'
      },
      boxShadow: {
        paper: '4px 4px 0px rgba(26,26,26,0.9)'
      },
      borderRadius: {
        xl2: '28px'
      }
    }
  },
  plugins: []
}
