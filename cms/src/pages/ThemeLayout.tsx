import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContexts";
import { Layout } from "../types";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import theme1 from "../assets/theme1-0.jpg";
import theme2 from "../assets/theme2-1.jpg";
import axios from "axios";

interface ThemeOption {
  id: string;
  name: string;
  image: string;
  description: string;
}

interface LayoutComponent {
  id: string;
  name: string;
  icon: string;
  column: "left" | "right";
}

const ThemeLayout = () => {
  const { user } = useGlobal();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>("theme1");
  const [sidebarPosition, setSidebarPosition] = useState<"left" | "right">(
    "left"
  );
  const [layoutComponents, setLayoutComponents] = useState<LayoutComponent[]>([
    { id: "author", name: "作者信息", icon: "👤", column: "left" },
    { id: "tags", name: "文章标签", icon: "🏷️", column: "left" },
    { id: "content", name: "文章内容", icon: "📝", column: "right" },
    { id: "comments", name: "评论区域", icon: "💬", column: "right" },
    { id: "related", name: "相关文章", icon: "📚", column: "left" },
  ]);

  const themes: ThemeOption[] = [
    {
      id: "theme1",
      name: "经典主题",
      image: theme1,
      description: "简洁大方的阅读体验",
    },
    {
      id: "theme2",
      name: "现代主题",
      image: theme2,
      description: "充满活力的现代设计",
    },
  ];

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    // 获取拖拽的组件
    const draggedItem = layoutComponents.find(
      (item) => item.id === result.draggableId
    );

    if (!draggedItem) return;

    const isMovingToLeftColumn =
      result.destination.droppableId === "left-column";
    const isRightComponent = draggedItem.column === "right";
    const isLeftComponent = draggedItem.column === "left";
    const isComments = draggedItem.id === "comments";

    // 特殊规则：评论区只能在右侧列
    if (isComments && isMovingToLeftColumn) {
      return;
    }

    // 如果是非法的跨列拖拽，直接返回
    if (
      (isRightComponent && isMovingToLeftColumn) || // 主要内容试图移到侧边栏
      (isLeftComponent && !isMovingToLeftColumn) // 侧边栏组件试图移到主要内容
    ) {
      return;
    }

    const items = Array.from(layoutComponents);
    const sourceIndex = items.findIndex(
      (item) => item.id === result.draggableId
    );
    const [movedItem] = items.splice(sourceIndex, 1);

    // 更新列信息
    const targetColumn = isMovingToLeftColumn ? "left" : "right";
    movedItem.column = targetColumn;

    // 获取目标位置的实际索引
    const targetItems = items.filter((item) => item.column === targetColumn);
    const remainingItems = items.filter((item) => item.column !== targetColumn);

    // 特殊处理：确保评论区始终在内容之后
    if (targetColumn === "right") {
      const contentIndex = targetItems.findIndex(
        (item) => item.id === "content"
      );

      if (isComments && result.destination.index <= contentIndex) {
        // 如果试图将评论区移到内容之前，强制放在内容之后
        targetItems.splice(contentIndex + 1, 0, movedItem);
      } else {
        // 正常插入
        targetItems.splice(result.destination.index, 0, movedItem);
      }
    } else {
      // 左侧栏正常插入
      targetItems.splice(result.destination.index, 0, movedItem);
    }

    // 重新组合所有项目
    setLayoutComponents([...targetItems, ...remainingItems]);
  };

  const toggleSidebarPosition = () => {
    setSidebarPosition((prev) => (prev === "left" ? "right" : "left"));
  };

  useEffect(() => {
    if (!user?.token) {
      navigate("/login");
      return;
    }

    const loadLayout = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Layout>(`/display/layout`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const { theme, sidebarPosition, components } = response.data;
        setSelectedTheme(theme);
        setSidebarPosition(sidebarPosition);
        if (components?.length) {
          setLayoutComponents(components);
        }
        setError(null);
      } catch (err) {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to load layout"
          : "An unexpected error occurred";
        setError(errorMessage);
        console.error("Failed to load layout:", err);
      } finally {
        setLoading(false);
      }
    };

    loadLayout();
  }, [user, navigate]);

  const handleSaveLayout = async () => {
    if (!user?.token) {
      navigate("/login");
      return;
    }

    try {
      setError(null);
      await axios.post(
        `$/admin/layout`,
        {
          theme: selectedTheme,
          sidebarPosition,
          components: layoutComponents,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("布局保存成功！");
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || "保存失败"
        : "保存失败，请重试";
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">主题选择</h2>
        <div className="grid grid-cols-3 gap-6">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                selectedTheme === theme.id
                  ? "border-orange-500 shadow-lg"
                  : "border-transparent"
              }`}
              onClick={() => setSelectedTheme(theme.id)}
            >
              <img
                src={theme.image}
                alt={theme.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 bg-white">
                <h3 className="font-bold">{theme.name}</h3>
                <p className="text-sm text-gray-600">{theme.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">布局设置</h2>
          <div className="flex gap-4">
            <button
              onClick={toggleSidebarPosition}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              侧边栏位置: {sidebarPosition === "left" ? "左侧" : "右侧"}
            </button>
            <button
              onClick={handleSaveLayout}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              保存布局
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div
              className="grid grid-cols-7 gap-6"
              style={{
                direction: sidebarPosition === "left" ? "ltr" : "rtl",
              }}
            >
              {/* 左栏（侧边栏组件） - 2列宽度 */}
              <div
                className="col-span-2 bg-white p-4 rounded-lg shadow-sm"
                style={{ direction: "ltr" }}
              >
                <h3 className="text-lg font-medium mb-4">侧边栏组件</h3>
                <Droppable droppableId="left-column">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2 min-h-[300px] border-2 border-dashed border-gray-200 rounded-lg p-2"
                    >
                      {layoutComponents
                        .filter((item) => item.column === "left")
                        .map((component, index) => (
                          <Draggable
                            key={component.id}
                            draggableId={component.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-orange-200"
                              >
                                <span className="mr-3">{component.icon}</span>
                                <span className="text-sm">
                                  {component.name}
                                </span>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* 右栏（主要内容） - 5列宽度 */}
              <div
                className="col-span-5 bg-white p-4 rounded-lg shadow-sm"
                style={{ direction: "ltr" }}
              >
                <h3 className="text-lg font-medium mb-4">主要内容</h3>
                <Droppable droppableId="right-column">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2 min-h-[300px] border-2 border-dashed border-gray-200 rounded-lg p-2"
                    >
                      {layoutComponents
                        .filter((item) => item.column === "right")
                        .map((component, index) => (
                          <Draggable
                            key={component.id}
                            draggableId={component.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-orange-200"
                              >
                                <span className="mr-3">{component.icon}</span>
                                <span>{component.name}</span>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default ThemeLayout;
