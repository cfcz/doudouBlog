/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      clipPath: {
        circle: "circle(50% at 50% 50%)",
      },
    },
  },
  plugins: [require("tailwind-clip-path")],
};
