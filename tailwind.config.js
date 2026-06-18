/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        lato: ["Lato", "sans-serif"],
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
