/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          primary: "#1a73e8",
          "base-100": "#ffffff",
          "base-200": "#f1f5f9",
          "base-300": "#e2e8f0",
          error: "#ea4335",
          "--rounded-btn": "24px",
        },
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          primary: "#1a73e8",
          secondary: "#3c4043",
          "base-100": "#202124",
          "base-200": "#303238",
          "base-300": "#334155",
          error: "#ea4335",
        },
      },
    ],
  },
};
