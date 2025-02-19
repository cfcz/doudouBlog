import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "../store/userSlice";
import { Author } from "../types";

const PostAuthor = ({ authorID }: { authorID: string }) => {
  const [author, setAuthor] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector(selectUser);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        if (!user?.token) return;

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/${authorID}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setAuthor(response.data);
      } catch (error) {
        console.error("Failed to fetch author:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (authorID) {
      fetchAuthor();
    }
  }, [authorID, user?.token]);

  if (isLoading) {
    return (
      <div className="animate-pulse flex items-center">
        <div className="w-10 h-10 bg-gray-200 rounded-full mr-4" />
        <div className="space-y-2">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <Link
      to={`/posts/users/${authorID}`}
      className="flex items-center hover:opacity-80 transition-opacity duration-300"
    >
      <div className="w-10 h-10 rounded-full mr-4 bg-orange-100 flex items-center justify-center text-orange-500 font-bold border-2 border-orange-200">
        {author?.username.charAt(0).toUpperCase()}
      </div>
      <div>
        <p className="text-gray-900 dark:text-gray-100 font-bold text-sm">
          {author?.username || "Unknown Author"}
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-xs">
          {author?.email}
        </p>
      </div>
    </Link>
  );
};

export default PostAuthor;
