import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#f8f5ef",
        ink: "#1d2a2c",
        coral: "#ff7a59",
        butter: "#ffd166",
        mint: "#88d8b0",
        sky: "#7ac7ff",
      },
      boxShadow: {
        soft: "0 20px 40px rgba(29, 42, 44, 0.08)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
