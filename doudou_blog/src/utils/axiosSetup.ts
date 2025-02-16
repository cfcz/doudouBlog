import axios from "axios";
import store from "../store";
import { clearUser } from "../store/userSlice";

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      // 处理 401 未授权错误
      if (error.response?.status === 401) {
        // 清除本地存储
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // 清除 Redux store
        store.dispatch(clearUser());
        // 重定向到登录页
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
