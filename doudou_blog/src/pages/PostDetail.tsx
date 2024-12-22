import PostAuthor from "../components/PostAuthor";
import { Link } from "react-router-dom";
import Thumbnail from "../assets/blog22.jpg";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const PostDetail = () => {
  return (
    <section className="py-8 px-4 bg-gray-100">
      <div className="container mx-auto bg-white rounded-lg shadow-md max-w-5xl p-6">
        <div className="flex items-center justify-between mb-4">
          <PostAuthor authorID={2} />
          <div className="flex space-x-2">
            <Link
              to="/posts/werwer/edit"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded hover:from-orange-600 hover:to-orange-700 transition duration-300"
            >
              Edit
            </Link>
            <Link
              to="/posts/werwer/delete"
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white py-2 px-4 rounded hover:from-gray-600 hover:to-gray-700 transition duration-300"
            >
              Delete
            </Link>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          This is the post title!
        </h1>
        <div className="mb-4">
          <img
            src={Thumbnail}
            alt="Post Thumbnail"
            className="w-full h-auto rounded-lg"
          />
        </div>
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Eagles, often referred to as having "eagle eyes," are renowned for
            their exceptionally sharp vision, which is a critical adaptation
            that has evolved over millions of years to suit their predatory
            lifestyle.
          </p>
          <p className="text-gray-700 leading-relaxed">
            The development of such keen eyesight can be attributed to several
            evolutionary pressures and natural selection processes that favored
            individuals with better vision.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Over time, these traits became more pronounced, resulting in the
            highly specialized visual capabilities seen in eagles today.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PostDetail;
