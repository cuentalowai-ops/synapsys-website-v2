import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Coral primary
        coral: {
          50: "#fff7f3",
          100: "#ffede4",
          200: "#ffd4bd",
          300: "#FFB088",
          400: "#ff8f52",
          500: "#ff7a3d",
          600: "#ff6b2e",
          700: "#e55c24",
          800: "#cc4d1f",
          900: "#993a17",
        },
        
        // Amber/Yellow secondary
        amber: {
          50: "#fffbeb",
          100: "#fff3c6",
          200: "#ffe89a",
          300: "#FFD97A",
          400: "#ffc043",
          500: "#F5B041",
          600: "#e69d2e",
          700: "#d68a1f",
          800: "#b36e17",
          900: "#8a530f",
        },
        
        // Teal/Cyan accent
        teal: {
          50: "#f0fafa",
          100: "#d9f2f2",
          200: "#b3e5e6",
          300: "#5BC0BE",
          400: "#4AABAB",
          500: "#2d9fa0",
          600: "#248b8c",
          700: "#1e7577",
          800: "#165f61",
          900: "#0f4a4b",
        },
        
        // Magenta/Rose accent
        magenta: {
          50: "#fdf4f7",
          100: "#fbe8ef",
          200: "#f7d1df",
          300: "#C06080",
          400: "#9B4D7A",
          500: "#8b4470",
          600: "#7a3b63",
          700: "#6b3356",
          800: "#5c2b49",
          900: "#4d243d",
        },
        
        // Purple/Indigo accent
        purple: {
          50: "#f5f3f7",
          100: "#ebe7ef",
          200: "#d7cfdf",
          300: "#7B68B0",
          400: "#6B5B9A",
          500: "#5d4e89",
          600: "#514478",
          700: "#463a67",
          800: "#3b3156",
          900: "#302845",
        },

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        display: ["var(--font-space-grotesk)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "cursor-follow": {
          "0%": { transform: "translate(-50%, -50%) scale(1)" },
          "100%": { transform: "translate(-50%, -50%) scale(1)" },
        },
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "cursor-follow": "cursor-follow 0.1s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config

