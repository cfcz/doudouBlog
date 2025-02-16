import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { BiMenu, BiX } from "react-icons/bi";

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isOpen, setIsOpen] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { id: "dashboard", path: "/", label: "Dashboard", icon: "📊" },
    { id: "manage", path: "/manage", label: "Posts", icon: "📋" },
    { id: "theme", path: "/theme", label: "Theme", icon: "🎨" },
    { id: "stats", path: "/status", label: "Statistics", icon: "📈" },
  ];

  return (
    <>
      <button
        className="fixed top-4 right-4 z-50 md:hidden bg-white p-2 rounded-lg shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <BiX size={24} /> : <BiMenu size={24} />}
      </button>

      <div
        className={`
          fixed md:sticky top-16
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          transition-transform duration-300 ease-in-out
          h-[calc(100vh-4rem)] w-56 bg-white shadow-r flex flex-col z-40
          overflow-y-auto border-r
        `}
      >
        <div className="p-4 pt-8">
          <Link
            to="/publish"
            className="flex items-center justify-center text-white bg-orange-400 hover:bg-orange-500 px-6 py-3 rounded-lg transition-colors text-base font-medium w-full"
          >
            <span>Create New Post!</span>
          </Link>
          <div className="relative h-4 mt-4">
            <svg
              className="absolute w-full"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
            >
              <path
                d="M0 0L10 8L20 0L30 8L40 0L50 8L60 0L70 8L80 0L90 8L100 0V10H0"
                fill="#f3f4f6"
                className="translate-y-[-1px]"
              />
            </svg>
          </div>
        </div>

        <nav className="flex-1 py-2 bg-gray-100">
          <ul className="space-y-3">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className="flex items-center text-gray-700 hover:text-orange-600 px-6 py-3 rounded-lg hover:bg-orange-50 mx-2 text-base font-medium"
                >
                  <span className="mr-4 w-5 text-center text-xl">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
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
