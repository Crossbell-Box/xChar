/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        accent: "var(--theme-color)",
      },
      boxShadow: {
        search: "0 1px 6px rgb(32 33 36 / 28%)",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
}
