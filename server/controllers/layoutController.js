const Layout = require("../models/layoutModel");

const saveLayout = async (req, res) => {
  try {
    const { theme, sidebarPosition, components } = req.body;

    // 更新或创建布局设置
    const layout = await Layout.findOneAndUpdate(
      { creator: req.user.id },
      {
        theme,
        sidebarPosition,
        components: components.map((comp, index) => ({
          ...comp,
          order: index,
        })),
      },
      { new: true, upsert: true }
    );

    res.status(200).json(layout);
  } catch (error) {
    res.status(500).json({ message: "保存布局失败", error: error.message });
  }
};

const getLayout = async (req, res) => {
  try {
    const layout = await Layout.findOne({ creator: req.user.id });

    // 默认布局配置
    const defaultLayout = {
      theme: "theme1",
      sidebarPosition: "right",
      components: [
        {
          id: "content",
          name: "文章内容",
          icon: "📝",
          column: "right",
          order: 0,
        },
        {
          id: "comments",
          name: "评论区域",
          icon: "💬",
          column: "right",
          order: 1,
        },
        {
          id: "tags",
          name: "文章标签",
          icon: "🏷️",
          column: "left",
          order: 2,
        },
        {
          id: "author",
          name: "作者信息",
          icon: "👤",
          column: "left",
          order: 3,
        },
        {
          id: "related",
          name: "相关文章",
          icon: "📚",
          column: "left",
          order: 4,
        },
      ],
    };

    res.json(layout || defaultLayout);
  } catch (error) {
    res.status(500).json({ message: "获取布局失败", error: error.message });
  }
};

module.exports = { saveLayout, getLayout };
