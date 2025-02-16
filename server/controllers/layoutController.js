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
    res.json(
      layout || { theme: "theme1", sidebarPosition: "left", components: [] }
    );
  } catch (error) {
    res.status(500).json({ message: "获取布局失败", error: error.message });
  }
};

module.exports = { saveLayout, getLayout };
