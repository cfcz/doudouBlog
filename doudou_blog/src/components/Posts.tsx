import { useState, useEffect } from "react";
import PostItem from "./PostItem";
import { useGlobal } from "../contexts/GlobalContexts";
import axiosInstance from "../utils/axiosSetup";

interface Post {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  creator: {
    _id: string;
    username: string;
  };
  mediaFiles: Array<{ url: string; type: string }>;
}

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useGlobal();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get(`/display/posts`);
        setPosts(response.data);
      } catch (err) {
        setError("Failed to fetch posts: " + err);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user?.token]);

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (error)
    return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-10">
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostItem
            key={post._id}
            postID={post._id}
            title={post.title}
            content={post.content}
            tags={post.tags}
            authorID={post.creator._id}
            mediaFiles={post.mediaFiles}
          />
        ))
      ) : (
        <h2 className="text-center col-span-full">No posts found</h2>
      )}
    </section>
  );
};

export default Posts;
