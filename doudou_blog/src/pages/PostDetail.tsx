import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "../store/userSlice";
import { Post, Layout } from "../types";
import axiosInstance from "../utils/axiosSetup";

const PostDetails = () => {
  const { id } = useParams<{ id: string }>();
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 如果没有用户登录，重定向到登录页
    if (!user?.token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        if (!id) {
          throw new Error("Post ID is required");
        }

        const [postRes, layoutRes] = await Promise.all([
          axiosInstance.get<Post>(`/posts/${id}`, {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
          axiosInstance.get<Layout>(`/layout`, {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
        ]);

        setPost(postRes.data);
        setLayout(layoutRes.data);
        setError(null);
      } catch (err) {
        // axios 拦截器会处理认证错误，这里只处理其他错误
        if (!axios.isAxiosError(err) || err.response?.status !== 401) {
          setError(
            axios.isAxiosError(err)
              ? err.response?.data?.message || "Failed to fetch data"
              : "An unexpected error occurred"
          );
        }
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchData();
    }
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
              <div className="flex items-center text-gray-600 text-sm space-x-4">
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
            </div>
            <div className="prose prose-orange lg:prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post?.content || "" }} />
            </div>
          </div>
        );

      case "author":
        if (!post.creator) return null;
        {
          const { username, email } = post.creator;
          return (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">👤</span>
                关于作者
              </h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-2xl">
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
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">💬</span>
              评论区
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-600 mb-2">还没有评论</p>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  发表评论
                </button>
              </div>
              {/* 评论列表将在这里展示 */}
            </div>
          </div>
        );

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
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
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
