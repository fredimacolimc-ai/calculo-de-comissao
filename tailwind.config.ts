import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0f2b47",
          DEFAULT: "#1e4b73",
          light: "#2a6a9e",
        },
        commission: "#2563eb",
        freight: "#16a34a",
        receivable: "#f59e0b",
        danger: "#ef4444",
        warning: "#eab308",
      },
    },
  },
  plugins: [],
} satisfies Config;
