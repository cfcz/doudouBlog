/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // 颜色
      colors: {
        // 现有主题
        default: {
          primary: "#FCF0DE", // 浅米色
          secondary: "#FEC5C4", // 柔和粉红
          background: "#A84444", // 深棕红
          text: "#661F26", // 深酒红
        },
        // 新主题
        detailed: {
          primary: "#FFBBC0", // 柔和粉红
          secondary: "#FFDDCA", // 温暖米白
          background: "#AAC1B1", // 淡绿色
          text: "#C84C5F", // 深玫瑰红
        },
      },
      // 背景渐变
      backgroundImage: {
        "default-gradient":
          "linear-gradient(to bottom right,rgba(252, 240, 222, 0.3),rgba(254, 197, 196, 0.3))", // 现有主题渐变
        "detailed-gradient":
          "linear-gradient(to right,rgba(255, 187, 191, 0.3),rgba(255, 221, 202, 0.3))", // 新主题渐变
        "default-pattern": "url('/patterns/default-pattern.svg')",
        "detailed-pattern": "url('/patterns/detailed-pattern.svg')",
        "default-sidebar":
          "linear-gradient(to bottom, #FCF0DE, #FEC5C4), url('/patterns/default-dots.svg')",
        "detailed-sidebar":
          "linear-gradient(to bottom, #FFBBC0, #FFDDCA), url('/patterns/detailed-dots.svg')",
      },
      // 字体
      fontFamily: {
        default: ["sans-serif", "Arial"], // 现有主题字体
        detailed: ["Arial", "sans-serif"], // 新主题字体
      },
      // 组件样式
      boxShadow: {
        default: "0px 4px 6px rgba(0, 0, 0, 0.1)", // 现有主题阴影
        detailed: "0px 8px 12px rgba(0, 0, 0, 0.2)", // 新主题阴影
      },
      // 添加动画
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-out forwards",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
