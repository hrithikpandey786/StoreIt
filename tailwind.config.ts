import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          DEFAULT: "#FA7275",
          100: "#EA6365",
        },
        red: "#FF7474",
        blue: "#56B8FF",
        error: "#b80000",
        green: "#3DD9B3",
        orange: "#F9AB72",
        light: {
          100: "#333F4E",
          200: "#A3B2C7",
          300: "#F2F5F9",
          400: "#F2F4F8"
        },
        dark: {
          100: "#04050C",
          200: "#131524"
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
