import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f1f5ff",
          100: "#dbe6ff",
          200: "#b4c8ff",
          300: "#8daaff",
          400: "#668cff",
          500: "#416eff",
          600: "#2a51e6",
          700: "#1f3db4",
          800: "#152981",
          900: "#0c1650"
        }
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 10px 40px -12px rgba(65, 110, 255, 0.35)"
      }
    }
  },
  future: {
    hoverOnlyWhenSupported: true
  }
};

export default config;
