import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useGlobal } from "../contexts/GlobalContexts";
import { Post, Layout } from "../types";
import axiosInstance from "../utils/axiosSetup";
import Comments from "../components/Comments";

const PostDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useGlobal();
  const mounted = useRef(true);
  const [post, setPost] = useState<Post | null>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [actionLoading, setActionLoading] = useState({
    like: false,
    favorite: false,
  });
  const [theme, setTheme] = useState<"default" | "detailed">("default");

  // 主题样式类映射
  const themeClasses = {
    container: {
      default: "bg-default-gradient",
      detailed: "bg-detailed-gradient",
    },
    card: {
      default: "bg-white shadow-default",
      detailed: "bg-white shadow-detailed",
    },
    title: {
      default: "font-default text-default-text",
      detailed: "font-detailed text-detailed-text",
    },
    tag: {
      default: "bg-default-primary text-default-text",
      detailed: "bg-detailed-primary text-detailed-text",
    },
  };

  const checkFollowStatus = useCallback(async () => {
    if (!user?.token || !post?.creator?._id) return;

    try {
      const response = await axiosInstance.get(
        `/display/users/${user.userId}/following`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const following = response.data;
      setIsFollowing(
        following.some((f: { _id: string }) => f._id === post.creator._id)
      );
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  }, [user, post]);

  useEffect(() => {
    if (
      post?.creator?._id &&
      user?.userId &&
      post.creator._id !== user.userId
    ) {
      checkFollowStatus();
    }
  }, [post, user, checkFollowStatus]);

  const handleFollowToggle = async () => {
    if (!user?.token || !post?.creator?._id) return;

    try {
      const endpoint = isFollowing ? "unfollow" : "follow";
      await axiosInstance.post(
        `/display/users/${endpoint}/${post.creator._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  useEffect(() => {
    mounted.current = true;

    const fetchData = async () => {
      try {
        if (!id) {
          throw new Error("Post ID is required");
        }

        const [postRes, layoutRes] = await Promise.all([
          axiosInstance.get<Post>(`/api/posts/${id}`, {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
          axiosInstance.get<Layout>(`/display/layout`, {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
        ]);

        if (mounted.current) {
          setPost(postRes.data);
          setLayout(layoutRes.data);
          // 设置从后端获取的主题
          setTheme(postRes.data.theme || "default");
          setError(null);
        }
      } catch (err) {
        if (mounted.current) {
          if (!axios.isAxiosError(err)) {
            setError("An unexpected error occurred");
          } else {
            setError(err.response?.data?.message || "Failed to fetch data");
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
  }, [id, user?.token]);

  useEffect(() => {
    if (post) {
      setIsLiked(post.isLiked || false);
      setIsFavorited(post.isFavorited || false);
      setLikesCount(post.likesCount || 0);
      setFavoritesCount(post.favoritesCount || 0);
    }
  }, [post]);

  const handleLike = async () => {
    if (!user?.token || !post?._id || actionLoading.like) return;

    setActionLoading((prev) => ({ ...prev, like: true }));
    try {
      const response = await axiosInstance.post(
        `/posts/${post._id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setIsLiked(response.data.isLiked);
      setLikesCount(response.data.likesCount);
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, like: false }));
    }
  };

  const handleFavorite = async () => {
    if (!user?.token || !post?._id || actionLoading.favorite) return;

    setActionLoading((prev) => ({ ...prev, favorite: true }));
    try {
      const response = await axiosInstance.post(
        `/posts/${post._id}/favorite`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setIsFavorited(response.data.isFavorited);
      setFavoritesCount(response.data.favoritesCount);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, favorite: false }));
    }
  };

  // 修改渲染组件函数中的样式
  const renderComponent = (componentId: string) => {
    if (!post) return null;

    switch (componentId) {
      case "content":
        return (
          <div className={`rounded-lg p-8 ${themeClasses.card[theme]}`}>
            <div className="mb-8">
              <h1
                className={`text-4xl font-bold mb-4 ${themeClasses.title[theme]}`}
              >
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
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLike}
                    disabled={actionLoading.like}
                    className={`flex items-center space-x-1 ${
                      isLiked ? "text-orange-500" : "text-gray-600"
                    } hover:text-orange-500 transition-colors`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill={isLiked ? "currentColor" : "none"}
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
                    <span>{likesCount}</span>
                  </button>
                  <button
                    onClick={handleFavorite}
                    disabled={actionLoading.favorite}
                    className={`flex items-center space-x-1 ${
                      isFavorited ? "text-orange-500" : "text-gray-600"
                    } hover:text-orange-500 transition-colors`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill={isFavorited ? "currentColor" : "none"}
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
                    <span>{favoritesCount}</span>
                  </button>
                </div>
              </div>
            </div>
            <div className={`prose prose-${theme} lg:prose-lg max-w-none`}>
              <div dangerouslySetInnerHTML={{ __html: post?.content || "" }} />
            </div>
          </div>
        );

      case "author": {
        if (!post.creator) return null;
        const { username, email, _id } = post.creator;
        const isOwnProfile = user?.userId === _id;

        return (
          <div className={`rounded-lg p-6 ${themeClasses.card[theme]}`}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">👤</span>
              关于作者
            </h3>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-2xl flex-shrink-0">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-bold text-gray-900 text-lg">
                    {username}
                  </h4>
                  {!isOwnProfile && (
                    <button
                      onClick={handleFollowToggle}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        isFollowing
                          ? "border-gray-300 text-gray-600 hover:bg-gray-50"
                          : "border-orange-500 text-orange-500 hover:bg-orange-50"
                      }`}
                    >
                      {isFollowing ? "已关注" : "+ 关注"}
                    </button>
                  )}
                </div>
                <p className="text-gray-600 text-sm">{email}</p>
              </div>
            </div>
          </div>
        );
      }

      case "tags":
        return (
          <div className={`rounded-lg p-6 ${themeClasses.card[theme]}`}>
            <h3
              className={`text-lg font-semibold mb-4 ${themeClasses.title[theme]}`}
            >
              <span className="mr-2">🏷️</span>
              文章标签
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags?.map((tag) => (
                <span
                  key={tag}
                  className={`px-4 py-2 rounded-full text-sm ${themeClasses.tag[theme]}`}
                >
                  {tag}
                </span>
              ))}
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
          <div className={`rounded-lg p-6 ${themeClasses.card[theme]}`}>
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

  // 修改最外层容器的样式
  return (
    <div className={`min-h-screen py-8 ${themeClasses.container[theme]}`}>
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
