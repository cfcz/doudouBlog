import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearUser());
    navigate("/login");
  }, [dispatch, navigate]);

  return null;
};

export default Logout;
