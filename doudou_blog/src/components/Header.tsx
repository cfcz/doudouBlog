import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import { AiOutlineClose } from "react-icons/ai";

const Header = () => {
  return (
    <>
      <nav className="bg-white p-4 shadow-md fixed w-full top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Navbar Logo" className="h-8 w-8 mr-2" />
            <span className="text-orange-600 text-xl font-bold">
              Doudou's Blog
            </span>
          </Link>
          <ul className="hidden md:flex space-x-4">
            <li>
              <Link to="/profile" className="text-black hover:text-orange-600">
                Ernest Achiever
              </Link>
            </li>
            <li>
              <Link to="/create" className="text-black hover:text-orange-600">
                Create Post
              </Link>
            </li>
            <li>
              <Link to="/authors" className="text-black hover:text-orange-600">
                Authors
              </Link>
            </li>
            <li>
              <Link to="/logout" className="text-black hover:text-orange-600">
                Logout
              </Link>
            </li>
          </ul>
          <button className="text-black hover:text-orange-600 md:hidden">
            <AiOutlineClose />
          </button>
        </div>
      </nav>
      <div className="h-16"></div>
    </>
  );
};

export default Header;
