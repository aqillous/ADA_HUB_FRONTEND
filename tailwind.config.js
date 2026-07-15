/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        lato: ["Lato", "sans-serif"],
      },
      colors: {
        wine: {
          950: "#3D1220",
          800: "#6E1F35",
        },
        brand: {
          700: "#2F5D9E",
          400: "#5B85C0",
        },
        cream: {
          50: "#F7F4F0",
        },
      },
      backgroundImage: {
        "app-glow":
          "radial-gradient(ellipse 80% 60% at 8% -10%, rgba(47,93,158,0.10), transparent 60%), radial-gradient(ellipse 70% 60% at 100% 110%, rgba(110,31,53,0.10), transparent 60%)",
        "auth-glow":
          "radial-gradient(ellipse 90% 70% at 15% 0%, rgba(91,133,192,0.35), transparent 55%), radial-gradient(ellipse 80% 70% at 100% 100%, rgba(61,18,32,0.55), transparent 55%), linear-gradient(160deg, #3D1220 0%, #6E1F35 55%, #2F5D9E 130%)",
        "dot-grid": "radial-gradient(rgba(61,18,32,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "22px 22px",
      },
    },
    animation: {
      shake: "shake 1s",
      shake_r: "shake_r 1s",
      scaleIn: "scaleIn 0.2s ease-out forwards",
    },
    keyframes: {
      shake: {
        "0%, 100%": { transform: "translateX(0)" },
        "20%, 60%": { transform: "translateX(-5px)" },
        "40%, 80%": { transform: "translateX(5px)" },
      },
      shake_r: {
        "0%, 100%": { transform: "translateX(0)" },
        "20%, 60%": { transform: "translateX(5px)" },
        "40%, 80%": { transform: "translateX(-5px)" },
      },
      scaleIn: {
        "0%": { transform: "scale(0.95)", opacity: "0" },
        "100%": { transform: "scale(1)", opacity: "1" },
      },
    },
  },
  plugins: [],
};
