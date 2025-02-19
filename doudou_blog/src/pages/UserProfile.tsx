import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../store/userSlice";
import axiosInstance from "../utils/axiosSetup";
import PostItem from "../components/PostItem";
import { Post } from "../types";

interface ProfileInfo {
  _id: string;
  username: string;
  email: string;
  followers: string[];
  followedUsers: string[];
  postCount: number;
  likeCount: number;
  favoriteCount: number;
}

const UserProfile = () => {
  const { userId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams({ tab: "posts" });
  const currentUser = useSelector(selectUser);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tab配置
  const tabs = [
    { id: "posts", label: "发布的文章" },
    { id: "favorites", label: "收藏的文章" },
    { id: "likes", label: "点赞的文章" },
  ];

  const activeTab = searchParams.get("tab") || "posts";

  // 获取用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${currentUser?.token}` },
        });
        setProfileInfo(response.data);
      } catch (error) {
        setError("Failed to fetch user information" + error);
      }
    };

    fetchUserInfo();
  }, [userId, currentUser?.token]);

  // 获取内容列表
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        let endpoint = "";
        switch (activeTab) {
          case "favorites":
            endpoint = `/posts/favorites/${userId}`;
            break;
          case "likes":
            endpoint = `/posts/likes/${userId}`;
            break;
          default:
            endpoint = `/posts/users/${userId}`;
        }

        const response = await axiosInstance.get(endpoint, {
          headers: { Authorization: `Bearer ${currentUser?.token}` },
        });
        setPosts(response.data);
      } catch (error) {
        setError("Failed to fetch content" + error);
      } finally {
        setLoading(false);
      }
    };

    if (userId && currentUser?.token) {
      fetchContent();
    }
  }, [userId, activeTab, currentUser?.token]);

  // 处理Tab切换
  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId });
  };

  if (!profileInfo) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 用户信息卡片 */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* 头像和基本信息 */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-4xl">
              {profileInfo.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profileInfo.username}
              </h1>
              <p className="text-gray-600">{profileInfo.email}</p>
            </div>
          </div>

          {/* 统计数据 */}
          <div className="flex gap-8 ml-auto">
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">
                {profileInfo.followers.length}
              </div>
              <div className="text-sm text-gray-600">粉丝</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">
                {profileInfo.followedUsers.length}
              </div>
              <div className="text-sm text-gray-600">关注</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">
                {profileInfo.postCount}
              </div>
              <div className="text-sm text-gray-600">文章</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">
                {profileInfo.likeCount}
              </div>
              <div className="text-sm text-gray-600">获赞</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab切换 */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 内容展示区域 */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostItem
              key={post._id}
              postID={post._id}
              title={post.title}
              content={post.content}
              tags={post.tags}
              authorID={post.creator._id}
              mediaFiles={post.mediaFiles}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          暂无
          {activeTab === "posts"
            ? "发布的文章"
            : activeTab === "favorites"
            ? "收藏的文章"
            : "点赞的文章"}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
