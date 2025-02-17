/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
      extend: {
        colors: {
          primary: "#2A4B7C",
          secondary: "#DDD5E1",
          screen: "#72A2C0",
          button: "#B4B4B4",
          graffiti: "#3D3D3D",
        },
        fontFamily: {
          atm: ["Courier New", "monospace"],
        },
        fontSize: {
          sm: "0.85rem",
          base: "1rem",
          lg: "1.25rem",
          xl: "1.5rem",
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
  