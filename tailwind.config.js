/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "rgb(234, 245, 255)",
          100: "rgb(204, 230, 255)",
          200: "rgb(157, 207, 253)",
          300: "rgb(94, 173, 247)",
          400: "rgb(23, 127, 224)",
          500: "rgb(0, 107, 207)",
          600: "rgb(0, 87, 169)",
          700: "rgb(0, 70, 135)",
          800: "rgb(0, 55, 107)",
          900: "rgb(0, 45, 88)",
          950: "rgb(0, 26, 50)",
        },
        grayButton: "rgb(233, 233, 233)",
        grayTag: "#BED0E0",
        background: "rgb(235, 235, 235)",
        cardBackground: "rgb(244, 244, 244)",
      },
      screens: {
        xl: "1180px",
      },
    },
  },
  plugins: [],
};
