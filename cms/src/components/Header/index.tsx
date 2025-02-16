const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md flex items-center justify-between px-6 z-10">
      <div className="flex items-center">
        <div className="text-xl font-bold mr-4">CMS</div>
        <h1 className="text-lg">博客管理系统</h1>
      </div>
      <div>
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer">
          U
        </div>
      </div>
    </header>
  );
};

export default Header;
