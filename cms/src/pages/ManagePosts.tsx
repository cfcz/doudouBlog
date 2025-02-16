import { BiLike, BiComment, BiBookmark, BiShow } from "react-icons/bi";

const ManagePosts = () => {
  const posts = [
    {
      id: 1,
      title: "理解 React 的运行机制",
      date: "2024-01-01",
      thumbnail: "https://picsum.photos/100/60",
      likes: 123,
      comments: 45,
      bookmarks: 67,
      views: 1234,
      status: "published",
    },
    // ...更多文章数据
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">笔记管理</h1>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="搜索文章..."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-400"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  文章
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  发布时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  数据
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-orange-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-[100px] h-[60px] object-cover rounded"
                      />
                      <div>
                        <div className="font-medium">{post.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <BiLike className="mr-1" />
                        {post.likes}
                      </div>
                      <div className="flex items-center">
                        <BiComment className="mr-1" />
                        {post.comments}
                      </div>
                      <div className="flex items-center">
                        <BiBookmark className="mr-1" />
                        {post.bookmarks}
                      </div>
                      <div className="flex items-center">
                        <BiShow className="mr-1" />
                        {post.views}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-orange-600 hover:text-orange-700">
                        编辑
                      </button>
                      <button className="text-red-600 hover:text-red-700">
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagePosts;
