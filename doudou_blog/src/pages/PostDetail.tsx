import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "../store/userSlice";
import { Post, Layout } from "../types";
import axiosInstance from "../utils/axiosSetup";
import Comments from "../components/Comments";

const PostDetails = () => {
  const { id } = useParams<{ id: string }>();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const mounted = useRef(true);

  const [post, setPost] = useState<Post | null>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mounted.current = true;

    const fetchData = async () => {
      if (!user?.token) {
        navigate("/login");
        return;
      }

      try {
        if (!id) {
          throw new Error("Post ID is required");
        }

        const [postRes, layoutRes] = await Promise.all([
          axiosInstance.get<Post>(`/posts/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axiosInstance.get<Layout>(`/layout`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);

        if (mounted.current) {
          setPost(postRes.data);
          setLayout(layoutRes.data);
          setError(null);
        }
      } catch (err) {
        if (mounted.current) {
          if (!axios.isAxiosError(err) || err.response?.status !== 401) {
            setError(
              axios.isAxiosError(err)
                ? err.response?.data?.message || "Failed to fetch data"
                : "An unexpected error occurred"
            );
          }
          console.error("Error fetching data:", err);
        }
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted.current = false;
    };
  }, [id, user, navigate]);

  const renderComponent = (componentId: string) => {
    if (!post) return null;

    switch (componentId) {
      case "content":
        return (
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* 将标题移动到内容区域 */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              <div className="flex items-center justify-between">
                <div className="text-gray-600 text-sm space-x-4 flex items-center">
                  <time className="flex items-center">
                    <span className="mr-2">📅</span>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </time>
                  <span>·</span>
                  <span className="flex items-center">
                    <span className="mr-2">👤</span>
                    {post.creator.username}
                  </span>
                </div>
                {/* 新增点赞和收藏按钮 */}
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-orange-500 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>0</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-orange-500 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                    <span>0</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="prose prose-orange lg:prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post?.content || "" }} />
            </div>
          </div>
        );

      case "author": {
        if (!post.creator) return null;
        const { username, email } = post.creator;
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">👤</span>
              关于作者
            </h3>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justifycenter text-orange-500 font-bold text-2xl">
                {username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg mb-1">
                  {username}
                </h4>
                <p className="text-gray-600">{email}</p>
              </div>
            </div>
          </div>
        );
      }

      case "tags":
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🏷️</span>
              文章标签
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-sm border border-orange-100 hover:bg-orange-100 transition-colors"
                >
                  {tag}
                </span>
              )) || <span className="text-gray-500">暂无标签</span>}
            </div>
          </div>
        );

      case "comments":
        // 确保所有必要的数据都存在才渲染评论组件
        if (!id || !user?.token || !user?.userId) {
          return null;
        }
        return <Comments postId={id} token={user.token} userId={user.userId} />;

      case "related":
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📚</span>
              相关文章
            </h3>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-center">暂无相关文章推荐</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !post || !layout) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error || "Post not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div
          className={`grid grid-cols-1 lg:grid-cols-7 gap-8 ${
            layout.sidebarPosition === "right" ? "flex-row-reverse" : ""
          }`}
        >
          {/* 主要内容区域 */}
          <div className="lg:col-span-5 space-y-8">
            {layout.components
              .filter((c) => c.column === "right")
              .sort((a, b) => a.order - b.order)
              .map((component) => (
                <div key={component.id}>{renderComponent(component.id)}</div>
              ))}
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-2 space-y-6">
            <div className="sticky top-6">
              {layout.components
                .filter((c) => c.column === "left")
                .sort((a, b) => a.order - b.order)
                .map((component) => (
                  <div key={component.id} className="mb-6">
                    {renderComponent(component.id)}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
