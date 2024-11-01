import { useState } from "react";
import { Link } from "react-router-dom";
import { DUMMY_POSTS } from "../data";

const Dashboard = () => {
  const [posts] = useState(DUMMY_POSTS);

  return (
    <section className="dashboard py-8 px-4 bg-gray-100 min-h-screen">
      {posts.length ? (
        <div className="container mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {posts.map((post) => {
            return (
              <article
                key={post.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                <div className="dashboard_post-info mb-4">
                  <div className="dashboard_post-thumbnail mb-4">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <h5 className="text-xl font-bold text-gray-900">
                    {post.title}
                  </h5>
                </div>
                <div className="dashboard_post-actions mt-auto flex space-x-2">
                  <Link
                    to={`/posts/${post.id}`}
                    className="btn bg-gray-500 text-white text-sm py-1 px-3 rounded-full hover:bg-gray-600 transition duration-300"
                  >
                    View
                  </Link>
                  <Link
                    to={`/posts/${post.id}/edit`}
                    className="btn bg-gray-700 text-white text-sm py-1 px-3 rounded-full hover:bg-gray-800 transition duration-300"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/posts/${post.id}`}
                    className="btn bg-orange-500 text-white text-sm py-1 px-3 rounded-full hover:bg-orange-600 transition duration-300"
                  >
                    Delete
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <h2 className="text-center text-gray-700 text-xl">No posts found</h2>
      )}
    </section>
  );
};

export default Dashboard;
