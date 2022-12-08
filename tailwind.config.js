/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        accent: "var(--theme-color)",
        "calendar-L1": "var(--color-calendar-graph-day-L1-bg)",
        "calendar-L2": "var(--color-calendar-graph-day-L2-bg)",
        "calendar-L3": "var(--color-calendar-graph-day-L3-bg)",
        "calendar-L4": "var(--color-calendar-graph-day-L4-bg)",
      },
      boxShadow: {
        search: "0 1px 6px rgb(32 33 36 / 28%)",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
}
