import { useState } from "react";
import {
  BiTrendingUp,
  BiUser,
  BiBookOpen,
  BiLike,
  BiComment,
} from "react-icons/bi";

const Status = () => {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("week");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">数据统计</h1>
        <div className="flex space-x-2">
          {["day", "week", "month"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as any)}
              className={`px-3 py-1 rounded-full text-sm ${
                timeRange === range
                  ? "bg-orange-100 text-orange-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {range === "day" ? "日" : range === "week" ? "周" : "月"}
            </button>
          ))}
        </div>
      </div>

      {/* 总览数据 */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "总文章数", value: "156", icon: BiBookOpen, trend: "+12" },
          {
            label: "总阅读量",
            value: "23.5k",
            icon: BiTrendingUp,
            trend: "+2.1k",
          },
          { label: "活跃粉丝", value: "1,289", icon: BiUser, trend: "+89" },
          { label: "互动总量", value: "3,456", icon: BiLike, trend: "+234" },
        ].map((item) => (
          <div key={item.label} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-gray-500 text-sm">{item.label}</div>
                <div className="text-2xl font-bold mt-1">{item.value}</div>
              </div>
              <item.icon className="text-orange-500 text-xl" />
            </div>
            <div className="text-green-500 text-sm mt-2">↑ {item.trend}</div>
          </div>
        ))}
      </div>

      {/* 文章发布趋势 & 分类分布 */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold mb-4">文章发布趋势</h2>
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
            趋势图表区域
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold mb-4">文章分类分布</h2>
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
            饼图区域
          </div>
        </div>
      </div>

      {/* 最受欢迎文章 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-bold mb-4">最受欢迎文章</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg"
            >
              <div className="text-2xl font-bold text-gray-300 w-8">
                #{index}
              </div>
              <img
                src={`https://picsum.photos/100/60?random=${index}`}
                alt=""
                className="w-[80px] h-[48px] object-cover rounded"
              />
              <div className="flex-1">
                <div className="font-medium">React性能优化最佳实践</div>
                <div className="text-sm text-gray-500 mt-1">
                  发布于 2024-01-01
                </div>
              </div>
              <div className="flex items-center space-x-4 text-gray-500">
                <div className="flex items-center">
                  <BiBookOpen className="mr-1" /> 1.2k
                </div>
                <div className="flex items-center">
                  <BiLike className="mr-1" /> 328
                </div>
                <div className="flex items-center">
                  <BiComment className="mr-1" /> 86
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 粉丝增长趋势 */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold mb-4">粉丝增长趋势</h2>
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
            折线图区域
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold mb-4">用户互动分析</h2>
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
            柱状图区域
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
