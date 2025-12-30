import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // LUMINOUS VOID v2 Palette (STRICT: Solo Void y Cyan)
        void: {
          DEFAULT: "#02040A", // Abismo azulado
          surface: "#0B1221", // Paneles opcionales
        },
        structure: {
          DEFAULT: "rgba(255, 255, 255, 0.08)", // Bordes finos
        },
        truth: {
          DEFAULT: "#38BDF8", // Cyan 400 - Verificación, Éxito, Activo
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
        },
        warning: {
          DEFAULT: "#FACC15", // Amber 400 - Procesando, Alerta
          400: "#FACC15",
          500: "#EAB308",
          600: "#D97706",
        },
        text: {
          primary: "#E2E8F0", // Slate 200
          muted: "#64748B", // Slate 500
        },
        // Mantener compatibilidad con shadcn
        border: "rgba(255, 255, 255, 0.08)",
        input: "rgba(255, 255, 255, 0.08)",
        ring: "#38BDF8",
        background: "#02040A",
        foreground: "#E2E8F0",
        primary: {
          DEFAULT: "#38BDF8",
          foreground: "#02040A",
        },
        secondary: {
          DEFAULT: "#0B1221",
          foreground: "#E2E8F0",
        },
        muted: {
          DEFAULT: "#0B1221",
          foreground: "#64748B",
        },
        accent: {
          DEFAULT: "#38BDF8",
          foreground: "#02040A",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#E2E8F0",
        },
        card: {
          DEFAULT: "transparent",
          foreground: "#E2E8F0",
        },
        popover: {
          DEFAULT: "#0B1221",
          foreground: "#E2E8F0",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        display: ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        // Fluid Typography con clamp()
        "fluid-hero": "clamp(2rem, 5vw, 4.5rem)",
        "fluid-h1": "clamp(1.75rem, 4vw, 3rem)",
        "fluid-h2": "clamp(1.5rem, 3vw, 2.25rem)",
        "fluid-h3": "clamp(1.25rem, 2.5vw, 1.875rem)",
        "fluid-body": "clamp(0.875rem, 1.5vw, 1rem)",
      },
      boxShadow: {
        "neon-cyan": "0 0 20px rgba(56, 189, 248, 0.2)",
        "neon-cyan-lg": "0 0 40px rgba(56, 189, 248, 0.3)",
        "neon-cyan-xl": "0 0 60px rgba(56, 189, 248, 0.4)",
        "glow-glass": "0 0 30px -10px rgba(56, 189, 248, 0.3)",
        "glow-glass-hover": "0 0 40px -5px rgba(56, 189, 248, 0.5)",
        "inner-glow": "inset 0 0 20px rgba(56, 189, 248, 0.1)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        "grid-pulse": {
          "0%, 100%": { opacity: "0.03" },
          "50%": { opacity: "0.08" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "33%": { transform: "translateY(-20px) translateX(10px)" },
          "66%": { transform: "translateY(10px) translateX(-10px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-30px) translateX(15px)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(56, 189, 248, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(56, 189, 248, 0.4)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "scanning": {
          "0%": { transform: "translateX(-100%) translateY(-100%) rotate(45deg)" },
          "100%": { transform: "translateX(200%) translateY(200%) rotate(45deg)" },
        },
        "aperture": {
          "0%, 100%": { 
            boxShadow: "0 0 0 0 rgba(56, 189, 248, 0.4), inset 0 0 20px rgba(56, 189, 248, 0.1)" 
          },
          "50%": { 
            boxShadow: "0 0 30px rgba(56, 189, 248, 0.6), inset 0 0 30px rgba(56, 189, 248, 0.2)" 
          },
        },
      },
      animation: {
        "grid-pulse": "grid-pulse 3s ease-in-out infinite",
        "float": "float 5s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "scan-line": "scan-line 3s linear infinite",
        "scanning": "scanning 3s linear infinite",
        "aperture": "aperture 2s ease-in-out infinite",
      },
      spacing: {
        "touch": "44px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
