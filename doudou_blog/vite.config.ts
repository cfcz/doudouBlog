import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  server: {
    proxy: {
      // 将所有以 /api 开头的请求转发到后端服务
      "/api": {
        target: "http://localhost:5000", // 后端服务地址
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },

      // 将所有以 /display 开头的请求也转发到后端服务
      "/display": {
        target: "http://localhost:5000", // 后端服务地址
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/display/, ""),
      },
    },
  },
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
});
