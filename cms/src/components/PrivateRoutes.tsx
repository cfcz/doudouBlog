import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosSetup";
import { useGlobal } from "../context/GlobalContexts";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { setUser } = useGlobal();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axiosInstance.get("/api/users/verify");
        const { token, ...userInfo } = response.data;
        setUser({ ...userInfo, token });
        setIsAuthenticated(true);
      } catch (err) {
        console.log("路由守卫验证err", err);
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
