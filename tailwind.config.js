import daisyui from "daisyui";

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
        xxs: { max: "350px" },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: false, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "light", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
};
