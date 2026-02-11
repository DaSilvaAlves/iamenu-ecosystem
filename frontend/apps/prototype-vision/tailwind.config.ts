import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ff4d00",
        "primary-hover": "#e64500",
        "bg-dark": "#0a0a0a",
        "bg-card": "#141414",
        "bg-sidebar": "#0f0f0f",
        "background-light": "#1a1a1a",
        "surface-light": "#141414",
        // Custom colors for Marketplace comparison tab (harmonized)
        "brand-orange": "#F2542D", // Keep as unique for specific orange
        "surface-dark": "#161616",
        "surface-card": "#1E1E1E",
        "text-muted": "#a0a0a0", // Harmonized with index.css variable
        "sidebar-bg": "#0B0B0B",
        "border": "#222222", // Harmonized with index.css variable
      },
    },
  },
  plugins: [],
} satisfies Config;
