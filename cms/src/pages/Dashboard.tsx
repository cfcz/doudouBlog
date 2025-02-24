import { useState } from "react";
// import { useGlobal } from "../context/GlobalContexts";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<"7days" | "30days">("7days");
  // const { user } = useGlobal();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">账号信息</h2>
          <div className="flex space-x-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
                A
              </div>
              <div className="space-y-1">
                <div className="font-medium text-lg">Admin</div>
                <div className="text-gray-500 text-sm">ID: admin123</div>
                <div className="text-gray-500 text-sm">
                  上次登录: 2024-01-01
                </div>
                <div className="text-gray-600 mt-2">热爱分享的三花猫</div>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-4 gap-4 ml-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">128</div>
                <div className="text-gray-600 text-sm">关注</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">256</div>
                <div className="text-gray-600 text-sm">粉丝</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">1.2k</div>
                <div className="text-gray-600 text-sm">获赞</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">89</div>
                <div className="text-gray-600 text-sm">收藏</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">创作</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-orange-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">12</div>
              <div className="text-gray-600">已发布</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-gray-600">草稿箱</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">256</div>
              <div className="text-gray-600">总阅读</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">数据面板</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setDateRange("7days")}
                className={`px-3 py-1 rounded-full text-sm ${
                  dateRange === "7days"
                    ? "bg-orange-100 text-orange-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                近7日
              </button>
              <button
                onClick={() => setDateRange("30days")}
                className={`px-3 py-1 rounded-full text-sm ${
                  dateRange === "30days"
                    ? "bg-orange-100 text-orange-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                近30日
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "浏览量", value: "2.1k", trend: "+12.5%" },
              { label: "访客数", value: "892", trend: "+8.2%" },
              { label: "点赞数", value: "328", trend: "+15.3%" },
              { label: "收藏数", value: "126", trend: "+5.7%" },
              { label: "评论数", value: "89", trend: "+9.1%" },
              { label: "新增粉丝", value: "45", trend: "+6.8%" },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-600 text-sm mb-1">{item.label}</div>
                <div className="flex items-end justify-between">
                  <div className="text-xl font-bold">{item.value}</div>
                  <div className="text-green-500 text-sm">{item.trend}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-48 bg-gray-50 rounded flex items-center justify-center">
            数据趋势图表
          </div>
        </div>
      </div>

      <div className="hidden lg:block space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">重要通知</h2>
          <div className="space-y-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="font-medium">系统更新</div>
              <div className="text-sm text-gray-600">新版本已发布</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="font-medium">待办事项</div>
              <div className="text-sm text-gray-600">3篇文章待审核</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">热门主题</h2>
          <div className="space-y-3">
            {["React", "TypeScript", "Tailwind CSS"].map((tag) => (
              <div
                key={tag}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
              >
                <span>{tag}</span>
                <span className="text-orange-600">32篇</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
