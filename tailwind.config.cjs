module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#086972", // Teal
        black: "#000000",   // Black
        white: "#ffffff",
        gray: {
          100: "#f5f5f5",
          200: "#e5e5e5",
        },
      },
      fontFamily: {
        fragment: ["Lato", "sans-serif"], // ✅ add your font
         
      },
    },
  },
  plugins: [],
};
