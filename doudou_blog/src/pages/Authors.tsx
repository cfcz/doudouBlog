import { useState } from "react";
import { Link } from "react-router-dom";
import Avatar1 from "../assets/avatar1.jpg";
import Avatar2 from "../assets/avatar2.jpg";
import Avatar3 from "../assets/avatar3.jpg";
import Avatar4 from "../assets/avatar4.jpg";
import Avatar5 from "../assets/avatar5.jpg";

interface Author {
  id: number;
  avatar: string;
  name: string;
  posts: number;
}

const authorsData: Author[] = [
  { id: 1, avatar: Avatar1, name: "John Doe", posts: 5 },
  { id: 2, avatar: Avatar2, name: "Jane Smith", posts: 3 },
  { id: 3, avatar: Avatar3, name: "Kwame Nkrumah", posts: 2 },
  { id: 4, avatar: Avatar4, name: "Nana Addo", posts: 0 },
  { id: 5, avatar: Avatar5, name: "Hajia Bintu", posts: 1 },
];

const Authors = () => {
  const [authors] = useState(authorsData);

  return (
    <section className="py-8 px-4 bg-gray-100">
      {authors.length > 0 ? (
        <div className="container mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {authors.map(({ id, avatar, name, posts }) => (
            <Link
              key={id}
              to={`/posts/users/${id}`}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 mb-4">
                <img
                  src={avatar}
                  alt={`Image of ${name}`}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="author_info">
                <h4 className="text-xl font-bold text-gray-900 mb-2">{name}</h4>
                <p className="text-gray-700">{posts} posts</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <h2 className="text-center text-gray-700 text-xl font-semibold">
          No users/authors found.
        </h2>
      )}
    </section>
  );
};

export default Authors;
