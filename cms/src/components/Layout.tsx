import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useGlobal } from "../context/GlobalContexts";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = () => {
  const { user } = useGlobal();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

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
