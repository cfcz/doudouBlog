import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 p-8 shadow-md">
      <div className="container mx-auto text-center">
        <ul className="flex flex-col space-y-4 md:flex-row md:flex-wrap md:space-y-0 justify-center md:space-x-4 mb-4 py-4">
          <li>
            <Link
              to="/posts/categories/Agriculture"
              className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 shadow-md"
            >
              Agriculture
            </Link>
          </li>
          <li>
            <Link
              to="/posts/categories/Business"
              className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 shadow-md"
            >
              Business
            </Link>
          </li>
          <li>
            <Link
              to="/posts/categories/Education"
              className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 shadow-md"
            >
              Education
            </Link>
          </li>
          <li>
            <Link
              to="/posts/categories/Uncategorized"
              className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 shadow-md"
            >
              Uncategorized
            </Link>
          </li>
          <li>
            <Link
              to="/posts/categories/Weather"
              className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 shadow-md"
            >
              Weather
            </Link>
          </li>
        </ul>
        <hr className="border-gray-700 my-4" />
        <p className="text-white text-sm">
          &copy; {new Date().getFullYear()} Doudou's Blog. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
