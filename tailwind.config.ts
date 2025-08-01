
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
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
        // Harmonized blue palette replacing purple references
        blue: {
          50: "hsl(var(--blue-50))",
          100: "hsl(var(--blue-100))",
          200: "hsl(var(--blue-200))",
          300: "hsl(var(--blue-300))",
          400: "hsl(var(--blue-400))",
          500: "hsl(var(--blue-500))",
          600: "hsl(var(--blue-600))",
          700: "hsl(var(--blue-700))",
          800: "hsl(var(--blue-800))",
          900: "hsl(var(--blue-900))",
          950: "hsl(var(--blue-950))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideIn: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "pulse-gentle": {
          "0%, 100%": { 
            transform: "scale(1)", 
            opacity: "1" 
          },
          "50%": { 
            transform: "scale(1.03)", 
            opacity: "0.9" 
          }
        },
        "blink-glow": {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 20px rgba(33, 150, 243, 0.6), 0 0 40px rgba(30, 136, 229, 0.3)",
            transform: "scale(1)"
          },
          "50%": {
            opacity: "0.7",
            boxShadow: "0 0 30px rgba(33, 150, 243, 0.9), 0 0 60px rgba(30, 136, 229, 0.6)",
            transform: "scale(1.05)"
          }
        },
        "icon-bounce": {
          "0%, 100%": {
            transform: "translateY(0) rotate(0deg)"
          },
          "50%": {
            transform: "translateY(-2px) rotate(5deg)"
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.3s ease-out",
        slideIn: "slideIn 0.3s ease-out",
        "pulse-gentle": "pulse-gentle 4s ease-in-out infinite",
        "blink-glow": "blink-glow 2s ease-in-out infinite",
        "icon-bounce": "icon-bounce 1s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
