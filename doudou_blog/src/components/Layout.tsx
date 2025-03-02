import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import { useGlobal } from "../contexts/GlobalContexts";
import "../styles/patterns.css";

const Layout = () => {
  const { isDarkMode } = useGlobal();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <div
      className={`flex h-screen overflow-hidden theme-transition
      ${
        isDarkMode === false
          ? "bg-default-pattern bg-opacity-50"
          : "bg-detailed-pattern bg-opacity-50"
      }`}
    >
      <Sidebar />
      <main
        className="flex-1 relative dark:bg-gray-900 dark:text-gray-100 
        animate-fade-in overflow-hidden"
      >
        <div className="absolute inset-0 overflow-y-auto ">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
