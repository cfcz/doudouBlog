import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  FC,
} from "react";

// 定义用户接口
interface User {
  userId: string;
  email: string;
  username: string;
  token: string;
}

// 定义上下文类型
interface GlobalContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  theme: string;
  toggleTheme: () => void;
}

// 创建上下文，默认值为 GlobalContextType 类型
const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

// 自定义挂钩
export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
};

// 定义 Provider 组件
interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: FC<GlobalProviderProps> = ({ children }) => {
  // 用户状态管理
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("user");
      console.log("Stored user:", stored); // 添加日志
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error parsing stored user:", error);
      return null;
    }
  });

  // 主题状态管理
  const [theme, setTheme] = useState("default"); // 默认主题
  const toggleTheme = () => {
    setTheme(theme === "default" ? "detailed" : "default");
  };

  // 监听用户状态变化，更新localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // 确保 value 属性的类型严格匹配 GlobalContextType
  const contextValue: GlobalContextType = {
    user,
    setUser,
    theme,
    toggleTheme,
  };

  // 添加调试信息
  console.log("Current user state:", user);

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};
