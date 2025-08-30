module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#BF1E2E',
        black: '#1a1a1a',
        white: '#ffffff',
        gray: {
          100: '#f5f5f5',
          200: '#e5e5e5',
          // ...add more if needed
        },
      },
     
    },
  },
  plugins: [],
}
