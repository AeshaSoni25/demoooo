import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        // Brand palette
        surface: {
          50:  "#f0f4ff",
          100: "#e0e9ff",
          900: "#05091a",
          950: "#020614",
        },
        risk: {
          low:      "#10b981",
          moderate: "#f59e0b",
          high:     "#f97316",
          critical: "#ef4444",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":  "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "mesh-blue":       "radial-gradient(at 40% 20%, hsla(217,100%,60%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%,   hsla(189,100%,56%,0.10) 0px, transparent 50%), radial-gradient(at 0%  50%, hsla(355,100%,60%,0.08) 0px, transparent 50%)",
      },
      boxShadow: {
        "glow-blue":     "0 0 20px rgba(59,130,246,0.35), 0 0 60px rgba(59,130,246,0.15)",
        "glow-red":      "0 0 20px rgba(239,68,68,0.40),  0 0 60px rgba(239,68,68,0.15)",
        "glow-orange":   "0 0 20px rgba(249,115,22,0.40), 0 0 60px rgba(249,115,22,0.15)",
        "glow-green":    "0 0 20px rgba(16,185,129,0.35), 0 0 60px rgba(16,185,129,0.12)",
        "card":          "0 1px 3px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
        "card-hover":    "0 2px 8px rgba(0,0,0,0.5), 0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
        "glass":         "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.2)",
      },
      keyframes: {
        "fade-up":   { from: { opacity:"0", transform:"translateY(16px)" }, to: { opacity:"1", transform:"translateY(0)" } },
        "fade-in":   { from: { opacity:"0" }, to: { opacity:"1" } },
        "scale-in":  { from: { opacity:"0", transform:"scale(0.95)" }, to: { opacity:"1", transform:"scale(1)" } },
        "slide-right": { from: { opacity:"0", transform:"translateX(-12px)" }, to: { opacity:"1", transform:"translateX(0)" } },
        shimmer:     { "0%": { backgroundPosition:"200% 0" }, "100%": { backgroundPosition:"-200% 0" } },
        "pulse-ring": { "0%": { transform:"scale(0.9)", opacity:"0.8" }, "70%": { transform:"scale(1.4)", opacity:"0" }, "100%": { transform:"scale(1.4)", opacity:"0" } },
        float:       { "0%,100%": { transform:"translateY(0px)" }, "50%": { transform:"translateY(-8px)" } },
        "spin-slow":  { to: { transform:"rotate(360deg)" } },
        flicker:     { "0%,100%": { opacity:"1" }, "50%": { opacity:"0.6" } },
      },
      animation: {
        "fade-up":    "fade-up 0.5s ease-out forwards",
        "fade-in":    "fade-in 0.4s ease-out forwards",
        "scale-in":   "scale-in 0.3s ease-out forwards",
        "slide-right":"slide-right 0.4s ease-out forwards",
        shimmer:      "shimmer 3s linear infinite",
        "pulse-ring":  "pulse-ring 2s ease-out infinite",
        float:        "float 4s ease-in-out infinite",
        "spin-slow":  "spin-slow 8s linear infinite",
        flicker:      "flicker 2s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      backdropBlur: { xs: "2px" },
    },
  },
  plugins: [],
};
export default config;
