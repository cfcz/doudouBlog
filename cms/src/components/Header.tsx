import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContexts";
import { BiLogOut } from "react-icons/bi";

const Header = () => {
  const { user, setUser } = useGlobal();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white text-gray-800 shadow-md flex items-center justify-between px-6 z-50">
      <div className="flex items-center">
        <Link to="/" className="flex items-center space-x-3">
          <img src={Logo} alt="Logo" className="h-8 w-8" />
          <span className="text-orange-600 text-xl font-bold">
            Doudou's CMS
          </span>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">{user?.email}</span>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 text-gray-600 hover:text-orange-500"
          title="登出"
        >
          <BiLogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
