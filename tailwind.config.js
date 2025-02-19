/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
      extend: {
        colors: {
          primary: "#2A4B7C",
          secondary: "#DDD5E1",
          screen: "#73abcf",
          screenBoxShadow: "#d6d9cf",
          button: "#c1c1c1",
          graffiti: "#3D3D3D",
          chat: "#FFFFFF",
          machine: "#efeee3",
          shadowMachine: "#bebebe",
          street: "#9374a3",
          atmHeader: "#136cae"
        },
        fontFamily: {
          atmH1: ['"Press Start 2P"', 'cursive'],
          atm: ['"VT323"', 'monospace'],
        },
        fontSize: {
          sm: "0.85rem",
          base: "1rem",
          lg: "1.25rem",
          xl: "2rem",
          "2xl": "2rem",
        },
        screens: {
          xs: "375px",
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1536px",
        },
        spacing: {
          "atm-padding": "1rem",
        },
      },
    },
    plugins: [],
  };
  