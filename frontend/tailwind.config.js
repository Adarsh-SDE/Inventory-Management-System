export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff9ff",
          100: "#def2ff",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1"
        },
        slateText: "#172033"
      },
      boxShadow: {
        line: "0 1px 0 rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};
