import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        zen: {
          bg: "#F8FAFC",
          surface: "#F1F5F9",
          text: "#475569",
          "text-dark": "#334155",
        },
      },
    },
  },
  plugins: [],
};
export default config;
