import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContexts";

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser } = useGlobal();

  const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(`/api/users/login`, userData, {
        withCredentials: true,
      });

      const { token, ...userInfo } = response.data;
      setUser({ ...userInfo, token });

      // 最后再导航
      setTimeout(() => navigate("/"), 100);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message);
      } else {
        setError("登录失败，请稍后重试" + error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          doudou's CMS!
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="mt-8 space-y-6">
          <div className="space-y-4">
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={changeInputHandler}
              placeholder="your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={changeInputHandler}
              placeholder="your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            登录
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
