import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF8", // base background
        ink: "#15140F", // primary text, warm near-black
        "ink-soft": "#55534A", // secondary text
        line: "#E3E0D6", // hairline borders / dividers
        oxblood: "#6E1E2B", // single accent: sale, active states, CTAs
        "oxblood-dark": "#57161F",
        sand: "#EFEBE0", // subtle fill for hover/badges
      },
      fontFamily: {
        display: ["'Fraunces Variable'", "Georgia", "serif"],
        sans: ["'Manrope Variable'", "Helvetica", "Arial", "sans-serif"],
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "2px",
      },
      maxWidth: {
        content: "1440px",
      },
      letterSpacing: {
        wide: "0.06em",
      },
    },
  },
  plugins: [],
};

export default config;
