import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import { throttle } from "lodash";
import { useGlobal } from "../contexts/GlobalContexts";
import {
  BiHome,
  BiUser,
  BiBookContent,
  BiDotsHorizontalRounded,
  BiMenu,
  BiX,
  BiSun,
  BiMoon,
  BiLogOut,
  BiLogIn,
} from "react-icons/bi";

interface NavLink {
  to: string;
  text: string;
  icon: JSX.Element;
  external?: boolean;
}

const Sidebar = () => {
  const { user, isDarkMode, toggleTheme } = useGlobal();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isOpen, setIsOpen] = useState(!isMobile);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const handleResize = throttle(() => {
    const mobile = window.innerWidth <= 768;
    setIsMobile(mobile);
    setIsOpen(!mobile);
  }, 100);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const navigationLinks: NavLink[] = [
    { to: "/", text: "Home", icon: <BiHome className="mr-3 text-xl" /> },
    {
      to: "http://localhost:5174",
      text: "Posts",
      icon: <BiBookContent className="mr-3 text-xl" />,
      external: true,
    },
  ];

  if (!user?.userId) {
    navigationLinks.push({
      to: "/login",
      text: "Login",
      icon: <BiLogIn className="mr-3 text-xl" />,
    });
  }

  if (user?.userId) {
    navigationLinks.push({
      to: `/profile/${user.userId}`,
      text: "Profile",
      icon: <BiUser className="mr-3 text-xl" />,
    });
  }

  return (
    <>
      <button
        className="fixed top-4 right-4 z-50 md:hidden bg-white dark:bg-gray-800 dark:text-gray-100 p-2 rounded-lg shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <BiX size={24} /> : <BiMenu size={24} />}
      </button>

      <div
        className={`fixed md:sticky top-0 
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        transition-transform duration-300 ease-in-out
        h-screen w-64 shadow-lg flex flex-col z-40
        overflow-y-auto sidebar-decoration
        ${
          isDarkMode
            ? "bg-default-sidebar text-detailed-text" // 修改暗色模式文字颜色为白色
            : "bg-detailed-sidebar text-detailed-text"
        }
        pattern-dots`}
      >
        <div className="p-4 border-b dark:border-gray-700">
          <Link to="/" className="flex items-center hover-lift">
            <img src={Logo} alt="Logo" className="h-8 w-8 mr-2 animate-float" />
            <span className="text-xl font-bold">Doudou's Blog</span>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-4">
            {navigationLinks.map((link) => (
              <li key={link.to} className="hover-lift">
                {link.external ? (
                  <a
                    href={link.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center p-2 rounded-lg 
                      transition-colors duration-200
                      ${
                        isDarkMode
                          ? "text-white/90 hover:text-white hover:bg-white/10" // 修改暗色模式下的链接样式
                          : "text-detailed-text hover:bg-detailed-primary/30"
                      }`}
                  >
                    {link.icon}
                    <span className="ml-3">{link.text}</span>
                  </a>
                ) : (
                  <Link
                    to={link.to}
                    className={`flex items-center p-2 rounded-lg 
                      transition-colors duration-200
                      ${
                        isDarkMode
                          ? "text-white/90 hover:text-white hover:bg-white/10" // 修改暗色模式下的链接样式
                          : "text-detailed-text hover:bg-detailed-primary/30"
                      }`}
                  >
                    {link.icon}
                    <span className="ml-3">{link.text}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {user?.userId && (
          <div className="p-4 border-t border-current/10 relative">
            {" "}
            {/* 修改分割线颜色 */}
            <button
              className={`flex items-center w-full p-2 rounded-lg
                transition-colors duration-200
                ${
                  isDarkMode
                    ? "text-white/90 hover:text-white hover:bg-white/10" // 修改More按钮样式
                    : "text-detailed-text hover:bg-detailed-primary/30"
                }`}
              onClick={() => setIsMoreOpen(!isMoreOpen)}
            >
              <BiDotsHorizontalRounded className="mr-3 text-xl" />
              More
            </button>
            {isMoreOpen && (
              <div
                className={`absolute bottom-full left-0 w-full rounded-lg p-2 mb-1
                ${
                  isDarkMode
                    ? "bg-default-primary/20 backdrop-blur-md" // 修改下拉菜单背景
                    : "bg-white shadow-lg"
                }`}
              >
                <button
                  onClick={toggleTheme}
                  className={`flex items-center w-full p-2 rounded-lg
                    transition-colors duration-200
                    ${
                      isDarkMode
                        ? "text-white/90 hover:text-white hover:bg-white/10"
                        : "text-detailed-text hover:bg-detailed-primary/30"
                    }`}
                >
                  {isDarkMode ? (
                    <>
                      <BiSun className="mr-3 text-xl" /> Light Mode
                    </>
                  ) : (
                    <>
                      <BiMoon className="mr-3 text-xl" /> Dark Mode
                    </>
                  )}
                </button>
                <Link
                  to="/logout"
                  className={`flex items-center w-full p-2 rounded-lg
                    transition-colors duration-200
                    ${
                      isDarkMode
                        ? "text-white/90 hover:text-white hover:bg-white/10"
                        : "text-detailed-text hover:bg-detailed-primary/30"
                    }`}
                >
                  <BiLogOut className="mr-3 text-xl" />
                  Logout
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
