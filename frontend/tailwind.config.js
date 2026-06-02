export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f3eee3",
        paper: "#fcfaf5",
        ink: "#1f2a24",
        muted: "#6f6a5f",
        line: "#d9cfbf",
        primary: {
          50: "#edf3ee",
          100: "#dce7de",
          500: "#4b6a5f",
          600: "#365247",
          700: "#243c33"
        },
        accent: {
          50: "#fdf2eb",
          100: "#f7ddcf",
          500: "#bc6c4b",
          600: "#9f5639"
        }
      },
      boxShadow: {
        line: "0 1px 0 rgba(31, 42, 36, 0.08)",
        card: "0 24px 70px rgba(71, 60, 45, 0.10)",
        float: "0 18px 44px rgba(71, 60, 45, 0.14)"
      }
    }
  },
  plugins: []
};
