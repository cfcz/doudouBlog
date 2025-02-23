// src/api/index.ts
import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import store, { RootState } from "../contexts";

// 创建 Axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`, // 从环境变量中获取 API 基础 URL
  timeout: 5000, // 请求超时时间
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 允许发送跨域请求时携带 cookie
});

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state: RootState = store.getState();
    const token = state.user.user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(config.headers.Authorization);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // 处理已知错误
      switch (error.response.status) {
        case 401:
          // 处理未授权错误
          return Promise.reject("Unauthorized");
        case 403:
          // 处理禁止访问错误
          return Promise.reject("Forbidden");
        case 404:
          // 处理资源未找到错误
          return Promise.reject("Not Found");
        case 500:
          // 处理服务器内部错误
          return Promise.reject("Internal Server Error");
        default:
          return Promise.reject("Unknown Error:" + error.response.data);
      }
    } else if (error.request) {
      // 处理请求发送失败的情况
      return Promise.reject("Request failed:" + error.request);
    } else {
      // 处理其他错误
      return Promise.reject("Error:" + error.message);
    }
  }
);

export default instance;
