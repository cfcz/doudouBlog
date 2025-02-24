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

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-center p-10">
        <div className="inline-block p-4 bg-red-50 rounded-lg">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );

  return (
    <section className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <div
            key={post._id}
            className="transform hover:-translate-y-1 transition-transform duration-200"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <PostItem
              postID={post._id}
              title={post.title}
              content={post.content}
              tags={post.tags}
              authorID={post.creator._id}
              mediaFiles={post.mediaFiles}
            />
          </div>
        ))
      ) : (
        <div className="col-span-full flex justify-center items-center min-h-[200px]">
          <h2 className="text-gray-500 text-lg">暂无文章</h2>
        </div>
      )}
    </section>
  );
};

export default Posts;
