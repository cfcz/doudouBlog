import axios from "axios";

// 创建一个弱引用对象来存储 setUser 函数
const contextRef = {
  setUser: null as ((user: unknown) => void) | null,
};

// 添加设置函数的方法
export const setAuthContext = (setUserFn: (user: unknown) => void) => {
  contextRef.setUser = setUserFn;
};

// 创建 axios 实例（移除 baseURL）
const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(
  async (config) => {
    // 在发送请求前检查并添加认证头
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 检查 Token 是否即将过期并尝试刷新
    await checkTokenExpiration();

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error)) {
      // 处理 401 未授权错误
      if (error.response?.status === 401) {
        // 清除本地存储
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // 使用 Context 清除用户状态
        if (contextRef.setUser) {
          contextRef.setUser(null);
        }
        // 重定向到登录页
        window.location.href = "/login";
      }
    }
    if (error.response) {
      console.error("Response error:", error.response.data);
    }
    return Promise.reject(error);
  }
);

// Token 续期逻辑
const checkTokenExpiration = async () => {
  const token = localStorage.getItem("token");
  if (!token) return; //localStorage存的短期token没有了

  try {
    // 解析 Token 的有效期
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = decodedToken.exp * 1000;
    const currentTime = Date.now();
    // 如果距离过期时间小于 3 分钟，则尝试刷新 Token
    if (currentTime + 3 * 60 * 1000 >= expirationTime) {
      // 假设后端提供了一个 /api/refresh-token 接口用于刷新 Token
      const response = await axios.post("/api/users/refresh-token", { token });
      const newToken = response.data.token;

      // 更新 Token 到本地存储和 Axios 默认配置
      localStorage.setItem("token", newToken);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${newToken}`;

      console.log("Token refreshed successfully!");
    }
  } catch (error) {
    console.error("Failed to refresh token:", error);

    // 如果续期失败，清除 Token 并登出用户
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (contextRef.setUser) {
      contextRef.setUser(null);
    }
    window.location.href = "/login";
  }
};

export default axiosInstance;
