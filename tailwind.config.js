/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        accent: "var(--theme-color)",
        "accent-emphasis": "var(--theme-color)",
        "calendar-L1": "var(--color-calendar-graph-day-L1-bg)",
        "calendar-L2": "var(--color-calendar-graph-day-L2-bg)",
        "calendar-L3": "var(--color-calendar-graph-day-L3-bg)",
        "calendar-L4": "var(--color-calendar-graph-day-L4-bg)",
      },
      boxShadow: {
        search: "0 1px 6px rgb(32 33 36 / 28%)",
      },
      keyframes: {
        shine: {
          "0%": {
            backgroundRepeat: "no-repeat",
            backgroundImage: `-webkit-linear-gradient(
                top left,
                rgba(250, 250, 250, 0.0) 0%,
                rgba(250, 250, 250, 0.0) 45%,
                rgba(250, 250, 250, 0.3) 48%,
                rgba(250, 250, 250, 0.5) 50%,
                rgba(250, 250, 250, 0.3) 52%,
                rgba(250, 250, 250, 0.0) 57%,
                rgba(250, 250, 250, 0.0) 100%
            )`,
            backgroundPosition: "-200px -200px",
            backgroundSize: "300px 300px",
          },
          "100%": {
            backgroundRepeat: "no-repeat",
            backgroundPosition: "125px 125px",
          },
        },
        "shine-xl": {
          "0%": {
            backgroundRepeat: "no-repeat",
            backgroundImage: `-webkit-linear-gradient(
                top left,
                rgba(250, 250, 250, 0.0) 0%,
                rgba(250, 250, 250, 0.0) 45%,
                rgba(250, 250, 250, 0.3) 48%,
                rgba(250, 250, 250, 0.5) 50%,
                rgba(250, 250, 250, 0.3) 52%,
                rgba(250, 250, 250, 0.0) 57%,
                rgba(250, 250, 250, 0.0) 100%
            )`,
            backgroundPosition: "-1143px -1143px",
            backgroundSize: "1714px 1714px",
          },
          "100%": {
            backgroundRepeat: "no-repeat",
            backgroundPosition: "714px 714px",
          },
        },
      },
      animation: {
        shine: "shine 5s ease-in-out infinite",
        "shine-xl": "shine-xl 5s ease-in-out infinite",
        rotate: "rotate 1s ease-in-out",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
}
