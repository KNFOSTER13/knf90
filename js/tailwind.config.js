module.exports = {
  theme: {
    extend: {
      fontFamily: {
        serif: ['"DM Serif Display"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        plum: '#2C0838',
        eggplant: '#1B0628',
        cream: '#FFF8F2',
        blush: '#FFD9C0',
        accentBlue: '#003a66', // Changed from lilac
        gold: '#E6C98C',
        overlay: '#FFF8F220',
        borderLight: '#FFF8F210',
      },
      boxShadow: {
        glow: '0 0 12px rgba(0, 58, 102, 0.4)', // Changed from lilac
      },
      backgroundImage: {
        'sparkle-gradient': 'linear-gradient(90deg, #FFD9C0, #003a66, #EED5A5)', // Changed from lilac
      },
    },
  },
}