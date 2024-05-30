/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#153448",
        tablehead: "#2E4374",
        tablerow: "#4B527E",
        dashcard: "#213555",
      },
    },
  },
  plugins: [],
};

