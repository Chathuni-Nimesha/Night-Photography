/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: {
          bg: "#07080A",
          alt: "#0C0E12",
          surface: "#12151C",
          text: "#F4F1EA",
          muted: "#9AA0AB",
          accent: "#C9A36A",
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "serif"],
        sans: ['"DM Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
