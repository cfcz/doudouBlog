import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect, useState } from "react";
import { throttle } from "lodash";
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
import { toggleTheme } from "../store/themeSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
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

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const NavigationLinks = () => (
    <>
      <div className="p-4 border-b dark:border-gray-700">
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Logo" className="h-8 w-8 mr-2" />
          <span className="text-orange-600 dark:text-orange-500 text-xl font-bold">
            Doudou's Blog
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-4">
          <li>
            <Link
              to="/"
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700"
            >
              <BiHome className="mr-3 text-xl" />
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/posts"
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700"
            >
              <BiBookContent className="mr-3 text-xl" />
              Posts
            </Link>
          </li>
          {!user?.userId && (
            <li>
              <Link
                to="/login"
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700"
              >
                <BiLogIn className="mr-3 text-xl" />
                Login
              </Link>
            </li>
          )}
          {user?.userId && (
            <li>
              <Link
                to={`/profile/${user.userId}`}
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700"
              >
                <BiUser className="mr-3 text-xl" />
                Profile
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {user?.userId && (
        <div className="p-4 border-t dark:border-gray-700 relative">
          <button
            className="flex items-center w-full text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700"
            onClick={() => setIsMoreOpen(!isMoreOpen)}
          >
            <BiDotsHorizontalRounded className="mr-3 text-xl" />
            More
          </button>

          {isMoreOpen && (
            <div className="absolute bottom-full left-0 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 mb-1">
              <button
                onClick={handleThemeToggle}
                className="flex items-center w-full text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700"
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
                className="flex items-center w-full text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700"
              >
                <BiLogOut className="mr-3 text-xl" />
                Logout
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );

  return (
    <>
      <button
        className="fixed top-4 right-4 z-50 md:hidden bg-white dark:bg-gray-800 dark:text-gray-100 p-2 rounded-lg shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <BiX size={24} /> : <BiMenu size={24} />}
      </button>

      <div
        className={`
        fixed md:sticky top-0 
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        transition-transform duration-300 ease-in-out
        h-screen w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col z-40
        overflow-y-auto
      `}
      >
        <NavigationLinks />
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
