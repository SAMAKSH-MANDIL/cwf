/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080c14",
        surface: "#0e1524",
        surfaceBorder: "#1e293b",
        surfaceHover: "#162035",
        accentCyan: "#06b6d4",
        accentEmerald: "#10b981",
        accentViolet: "#8b5cf6",
        accentAmber: "#f59e0b",
        // Retro editorial palette from reference image
        retroCream: "#FBF7F0",
        retroCreamDark: "#F3EDE2",
        retroInk: "#1C1917",
        retroOrange: "#E05338",
        retroYellow: "#E5A638",
        retroDarkCard: "#181A24",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Courier New", "monospace"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      }
    },
  },
  plugins: [],
}
