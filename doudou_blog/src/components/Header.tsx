import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import { AiOutlineClose } from "react-icons/ai";
import { FaBars } from "react-icons/fa";
import { useEffect, useState } from "react";
import { throttle } from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const Header = () => {
  const [isMdScreen, setIsMdScreen] = useState(() => {
    if (window.innerWidth > 768) return true;
    return false;
  });
  const [isDropdown, setIsDropdown] = useState(false);

  // 处理窗口 resize 事件
  const handleResize = () => {
    const width = window.innerWidth;
    if (width > 768) {
      setIsMdScreen(true);
    } else {
      setIsMdScreen(false);
    }
  };

  // 使用 lodash 的 throttle 函数
  const throttledHandleResize = throttle(handleResize, 100);

  // 使用 useSelector 钩子访问 Redux 中的用户状态
  const user = useSelector((state: RootState) => state.user.user);

  // 添加和移除窗口 resize 事件监听器
  useEffect(() => {
    // 添加事件监听器
    window.addEventListener("resize", throttledHandleResize);
    // 初始检查窗口宽度
    handleResize();
    // 清理事件监听器
    return () => {
      window.removeEventListener("resize", throttledHandleResize);
    };
  }, [throttledHandleResize]);

  return (
    <>
      <nav className="bg-white p-4 py-4 shadow-md fixed w-full top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Navbar Logo" className="h-8 w-8 mr-2" />
            <span className="text-orange-600 text-xl font-bold">
              Doudou's Blog
            </span>
          </Link>
          {user?.userId && (isMdScreen || isDropdown) && (
            <div className="link_container fixed top-16 right-0 bg-white rounded-lg md:static">
              <ul className="flex flex-col p-2 text-center space-y-2 md:flex-row md:p-0 md:space-x-4 md:space-y-0 ">
                <li>
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdown(false)}
                    className="bg-orange-100 rounded-lg p-2 w-full inline-block text-black hover:text-orange-600"
                  >
                    Ernest Achiever
                  </Link>
                </li>
                <li>
                  <Link
                    to="/create"
                    onClick={() => setIsDropdown(false)}
                    className="bg-orange-100 rounded-lg p-2 w-full inline-block text-black hover:text-orange-600"
                  >
                    Create Post
                  </Link>
                </li>
                <li>
                  <Link
                    to="/authors"
                    onClick={() => setIsDropdown(false)}
                    className="bg-orange-100 rounded-lg p-2 w-full inline-block text-black hover:text-orange-600"
                  >
                    Authors
                  </Link>
                </li>
                <li>
                  <Link
                    to="/logout"
                    onClick={() => setIsDropdown(false)}
                    className="bg-orange-100 rounded-lg p-2 w-full inline-block text-black hover:text-orange-600"
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          )}
          {!user?.userId && (isMdScreen || isDropdown) && (
            <div className="link_container fixed top-16 right-0 bg-white rounded-lg md:static">
              <ul className="flex flex-col p-2 text-center space-y-2 md:flex-row md:p-0 md:space-x-4 md:space-y-0 ">
                <li>
                  <Link
                    to="/authors"
                    onClick={() => setIsDropdown(false)}
                    className="bg-orange-100 rounded-lg p-2 w-full inline-block text-black hover:text-orange-600"
                  >
                    Authors
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    onClick={() => setIsDropdown(false)}
                    className="bg-orange-100 rounded-lg p-2 w-full inline-block text-black hover:text-orange-600"
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </div>
          )}
          <button
            className="text-black hover:text-orange-600 md:hidden"
            onClick={() => setIsDropdown(!isDropdown)}
          >
            {isDropdown ? <AiOutlineClose /> : <FaBars />}
          </button>
        </div>
      </nav>
      <div className="h-16"></div>
    </>
  );
};

export default Header;
