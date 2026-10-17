import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        menhati: {
          olive: "#8b9a6e",
          cream: "#f7f2eb",
          beige: "#eae2d6",
          dark: "#2d3a2e",
          teal: "#2a9d8f",
        }
      },
      fontFamily: {
        tajawal: ["Tajawal", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      }
    },
  },
  plugins: [],
};
export default config;
