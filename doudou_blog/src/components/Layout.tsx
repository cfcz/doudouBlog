import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const Layout = () => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 relative dark:bg-gray-900 dark:text-gray-100">
        <div className="absolute inset-0 overflow-y-auto px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
