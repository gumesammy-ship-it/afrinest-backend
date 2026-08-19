/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ocean: {
          900: "#042E7B",
          700: "#004EE0",
          500: "#1883FF",
          300: "#99CAFF",
          100: "#E3F2FF",
        },
      },
    },
  },
  plugins: [],
}
