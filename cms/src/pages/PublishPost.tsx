import { useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import {
  BiBold,
  BiItalic,
  BiUnderline,
  BiStrikethrough,
  BiListUl,
  BiListOl,
  BiCode,
  BiImage,
  BiVideo,
} from "react-icons/bi";
import { uploadMedia } from "../services/upload";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "../store/userSlice";
// import "../styles/editor.css";

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  const handleFileUpload = async (type: "image" | "video") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = type === "image" ? "image/*" : "video/*";

    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          // 上传文件到服务器
          const { url } = await uploadMedia(file);

          if (type === "image") {
            editor.chain().focus().setImage({ src: url }).run();
          } else {
            editor
              .chain()
              .focus()
              .insertContent(
                `
                <video controls class="w-full rounded-lg">
                  <source src="${url}" type="${file.type}">
                </video>
              `
              )
              .run();
          }
        } catch (error) {
          console.error("Failed to upload file:", error);
          // TODO: 添加错误提示
        }
      }
    };
    input.click();
  };

  const buttons = [
    {
      icon: <BiBold className="w-4 h-4" />,
      label: "粗体",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
    },
    {
      icon: <BiItalic className="w-4 h-4" />,
      label: "斜体",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
    },
    {
      icon: <BiUnderline className="w-4 h-4" />,
      label: "下划线",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive("underline"),
    },
    {
      icon: <BiStrikethrough className="w-4 h-4" />,
      label: "删除线",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
    },
    {
      icon: <BiListUl className="w-4 h-4" />,
      label: "无序列表",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
    },
    {
      icon: <BiListOl className="w-4 h-4" />,
      label: "有序列表",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
    },
    {
      icon: <BiCode className="w-4 h-4" />,
      label: "代码块",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive("codeBlock"),
    },
  ];

  return (
    <div className="border-b p-3 space-x-1 flex items-center flex-wrap">
      {buttons.map((button) => (
        <button
          key={button.label}
          onClick={button.action}
          className={`p-2 rounded hover:bg-gray-100 transition-colors flex items-center space-x-1 ${
            button.isActive ? "bg-gray-100 text-orange-500" : "text-gray-700"
          }`}
          title={button.label}
        >
          {button.icon}
        </button>
      ))}

      <div className="w-px h-6 bg-gray-200 mx-2" />

      <button
        onClick={() => handleFileUpload("image")}
        className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-700"
        title="插入图片"
      >
        <BiImage className="w-4 h-4" />
      </button>

      <button
        onClick={() => handleFileUpload("video")}
        className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-700"
        title="插入视频"
      >
        <BiVideo className="w-4 h-4" />
      </button>
    </div>
  );
};

const PublishPost = () => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const user = useSelector(selectUser);

  const editor = useEditor({
    extensions: [StarterKit, Image, Link, Underline],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl m-5 focus:outline-none",
      },
    },
  });

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handlePublish = async () => {
    try {
      if (!title.trim()) {
        alert("请输入文章标题");
        return;
      }

      if (!editor?.getHTML()) {
        alert("请输入文章内容");
        return;
      }

      if (!user?.token) {
        alert("请先登录");
        return;
      }

      const postData = {
        title,
        content: editor.getHTML(),
        tags,
      };

      console.log("Sending post data:", postData);

      // 使用完整的URL
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const response = await axios.post(`${baseUrl}/posts`, postData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        timeout: 5000, // 添加超时设置
        withCredentials: true,
      });

      console.log("Server response:", response.data);

      // 清空表单
      setTitle("");
      setTags([]);
      editor.commands.clearContent();

      alert("文章发布成功！");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          console.error("请求超时");
          alert("请求超时，请重试");
        } else {
          console.error("Error details:", {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers,
          });
          alert(error.response?.data?.message || "发布失败");
        }
      } else {
        console.error("Unknown error:", error);
        alert("发布失败，请重试");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">发布文章</h1>
        <button
          onClick={handlePublish}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          发布
        </button>
      </div>

      <div className="space-y-8">
        {/* 标题输入 */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入文章标题..."
            className="w-full px-4 py-3 text-xl focus:outline-none border-b border-gray-200 focus:border-orange-500 transition-colors"
          />
        </div>

        {/* 标签输入 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
              placeholder="添加标签..."
              className="flex-1 px-4 py-2 focus:outline-none border-b border-gray-200 focus:border-orange-500 transition-colors"
            />
            <button
              onClick={handleAddTag}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              添加
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full flex items-center"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-orange-400 hover:text-orange-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* TipTap 编辑器 */}
        <div className="bg-white rounded-lg border">
          <MenuBar editor={editor} />
          <div className="p-4">
            <EditorContent
              editor={editor}
              className="min-h-[500px] prose max-w-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishPost;
