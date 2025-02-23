import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // 将所有以 /api 开头的请求转发到后端服务
      "/api": {
        target: "http://localhost:5000", // 后端服务地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },

      // 将所有以 /admin 开头的请求也转发到后端服务
      "/admin": {
        target: "http://localhost:5000", // 后端服务地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/admin/, ""),
      },
    },
  },
  plugins: [react()],
});
