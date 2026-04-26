/** @type {import('tailwindcss').Config} */
const colorVar = (name) => `rgb(var(${name}) / <alpha-value>)`;

module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: colorVar("--c-bg"),
        surface: colorVar("--c-surface"),
        elevated: colorVar("--c-elevated"),
        border: colorVar("--c-border"),
        muted: colorVar("--c-muted"),
        text: colorVar("--c-text"),
        subtext: colorVar("--c-subtext"),
        accent: colorVar("--c-accent"),
        "accent-soft": colorVar("--c-accent-soft"),
        "accent-strong": colorVar("--c-accent-strong"),
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        glow: "0 0 60px -10px rgb(var(--c-accent) / 0.55)",
        panel: "0 1px 0 rgb(var(--c-border) / 0.6), 0 8px 24px -12px rgba(0,0,0,0.6)",
        ink: "0 18px 40px -18px rgba(0,0,0,0.85)",
      },
      backgroundImage: {
        "ink-grid":
          "radial-gradient(rgb(var(--c-border) / 0.55) 1px, transparent 1px)",
      },
      animation: {
        "ink-spread": "inkSpread 1.6s cubic-bezier(.22,1,.36,1) forwards",
        "glow-pulse": "glowPulse 2.4s ease-in-out infinite",
        "slash-in": "slashIn 0.9s cubic-bezier(.65,.05,.35,1) forwards",
        "float-slow": "floatSlow 7s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
        "fade-up": "fadeUp 0.55s cubic-bezier(.22,1,.36,1) both",
      },
      keyframes: {
        inkSpread: {
          "0%": { transform: "scale(0.2)", opacity: "0" },
          "60%": { opacity: "1" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        glowPulse: {
          "0%,100%": { filter: "drop-shadow(0 0 6px rgb(var(--c-accent)/0.55))" },
          "50%": { filter: "drop-shadow(0 0 22px rgb(var(--c-accent)/0.95))" },
        },
        slashIn: {
          "0%": { transform: "translateX(-120%) skewX(-25deg)", opacity: "0" },
          "60%": { opacity: "1" },
          "100%": { transform: "translateX(120%) skewX(-25deg)", opacity: "0" },
        },
        floatSlow: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
