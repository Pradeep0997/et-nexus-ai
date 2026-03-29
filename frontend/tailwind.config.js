/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ── Core Palette ──────────────────────────────────────
        // Deep space background tones
        void: { DEFAULT: "#09090f", 800: "#0f0f1a", 700: "#13131f", 600: "#1a1a2e" },

        // Deep purples
        royal: {
          50: "#ece9ff", 100: "#cfc7ff", 200: "#aba0ff", 300: "#8576ff",
          400: "#6952ff", 500: "#5533ff", 600: "#4929db", 700: "#3b1eb7",
          800: "#2d1593", 900: "#1f0c70"
        },

        // Neon pink / magenta
        neon: {
          50: "#ffe5f8", 100: "#ffb3ef", 200: "#ff80e5", 300: "#ff4ddb",
          400: "#ff1ad1", 500: "#e600b8", 600: "#b30090", 700: "#800068",
          800: "#4d003f", 900: "#1a0015"
        },

        // Cyan accent
        cyber: {
          50: "#e0fbff", 100: "#b3f5ff", 200: "#80efff", 300: "#4de9ff",
          400: "#1ae3ff", 500: "#00cceb", 600: "#00a0b8", 700: "#007485",
          800: "#004852", 900: "#001c1f"
        },

        // Slate grays
        slate: { 850: "#1a1f2e", 900: "#0f1117", 950: "#080b12" },
      },

      fontFamily: {
        sans: ["'Inter'", "'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
        display: ["'Sora'", "'Inter'", "system-ui", "sans-serif"],
      },

      backgroundImage: {
        "hero-glow":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(85,51,255,0.35) 0%, transparent 70%)",
        "card-glass":
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
        "neon-border":
          "linear-gradient(90deg, #5533ff, #e600b8, #00cceb)",
      },

      boxShadow: {
        "neon-purple": "0 0 20px rgba(85,51,255,0.5), 0 0 60px rgba(85,51,255,0.15)",
        "neon-pink": "0 0 20px rgba(230,0,184,0.5), 0 0 60px rgba(230,0,184,0.15)",
        "neon-cyan": "0 0 20px rgba(0,204,235,0.5), 0 0 60px rgba(0,204,235,0.15)",
        "glass": "0 8px 32px 0 rgba(0,0,0,0.37), inset 0 1px 0 rgba(255,255,255,0.08)",
      },

      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite alternate",
        "slide-up": "slideUp 0.4s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
      },

      keyframes: {
        glowPulse: {
          "0%": { boxShadow: "0 0 10px rgba(85,51,255,0.3)" },
          "100%": { boxShadow: "0 0 30px rgba(85,51,255,0.7), 0 0 60px rgba(230,0,184,0.3)" },
        },
        slideUp: {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },

      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },

      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
