import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../contexts/GlobalContexts";

const Logout = () => {
  const { setUser } = useGlobal();
  const navigate = useNavigate();

  useEffect(() => {
    setUser(null);
    navigate("/login");
  }, [setUser, navigate]);

  return null;
};

export default Logout;
