import Posts from "../components/Posts";
import { useGlobal } from "../contexts/GlobalContexts";

const Home = () => {
  const { isDarkMode } = useGlobal();

  return (
    <div className="min-h-screen">
      {/* 装饰性背景元素 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
        <div className="absolute top-40 right-20 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float delay-300" />
        <div className="absolute bottom-40 left-1/4 w-36 h-36 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float delay-500" />
      </div>

      {/* 内容区域 */}
      <div className="relative">
        <div className={`py-8 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
          <div className="container mx-auto px-4">
            <Posts />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
