import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <section className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-orange-600 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-8">Page Not Found</p>
        <Link
          to="/"
          className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </section>
  );
};

export default ErrorPage;
