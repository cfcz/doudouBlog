const Sidebar = () => {
  const menuItems = [
    { id: "publish", label: "发布笔记", icon: "📝" },
    { id: "manage", label: "笔记管理", icon: "📋" },
    { id: "theme", label: "主题布局", icon: "🎨" },
    { id: "dashboard", label: "数据看板", icon: "📊" },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-48 bg-white shadow-md">
      <nav className="py-4">
        {menuItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="flex items-center px-6 py-3 hover:bg-gray-100 cursor-pointer"
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
