import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        userData,
        { withCredentials: true }
      );

      const { token, ...userInfo } = response.data;

      // 使用 localStorage 替代 sessionStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userInfo));

      dispatch(setUser({ ...userInfo, token }));
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message);
      } else {
        setError(String(error));
      }
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        {error && (
          <p className="bg-red-100 text-red-700 border border-red-400 px-4 py-2 rounded text-center mb-4">
            {error}
          </p>
        )}
        <form onSubmit={submitHandler} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition duration-300"
          >
            Login
          </button>
        </form>
        <small className="block mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/login" className="text-orange-500 hover:underline">
            Sign Up
          </Link>
        </small>
      </div>
    </section>
  );
};

export default Login;
