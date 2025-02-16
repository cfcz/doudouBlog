import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../store/userSlice";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        if (tokenData.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } catch (error) {
        console.error("Token validation error:", error);
      }
    };

    checkAuth();
  }, []); // 只在组件挂载时检查一次

  // 如果用户未登录，返回 null 而不是立即重定向
  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="flex-1 relative bg-gray-50">
          <div className="absolute inset-0 overflow-y-auto px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
