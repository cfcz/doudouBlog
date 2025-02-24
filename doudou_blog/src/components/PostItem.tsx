import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor";
import { useGlobal } from "../contexts/GlobalContexts";

interface PostItemProps {
  postID: string;
  content: string;
  tags: string[];
  title: string;
  authorID: string;
  mediaFiles: Array<{ url: string; type: string }>;
}

const PostItem: React.FC<PostItemProps> = ({
  postID,
  content,
  tags,
  title,
  authorID,
  mediaFiles,
}) => {
  const { isDarkMode } = useGlobal();
  const defaultThumbnail = "/logo.png"; // 默认缩略图

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = defaultThumbnail;
    e.currentTarget.classList.add("object-contain", "p-4");
  };

  return (
    <article
      className={`
        h-[24rem] flex flex-col
        relative overflow-hidden rounded-lg
        ${
          isDarkMode
            ? "bg-detailed-primary/10 hover:bg-detailed-primary/20"
            : "bg-default-primary/10 hover:bg-default-primary/20"
        } 
        transition-all duration-300 group
      `}
    >
      {/* 媒体文件预览区域 - 固定高度 */}
      <div className="h-48 overflow-hidden bg-white/50">
        <img
          src={mediaFiles?.[0]?.url || defaultThumbnail}
          alt={title}
          onError={handleImageError}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        {/* 标签展示 */}
        <div className="absolute top-2 right-2 flex gap-2">
          {tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={`
                px-2 py-1 text-xs rounded-full
                ${
                  isDarkMode
                    ? "bg-detailed-secondary/80 text-detailed-text"
                    : "bg-default-secondary/80 text-default-text"
                }
                backdrop-blur-sm
              `}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 文章内容区域 - 弹性伸展 */}
      <div className="flex-1 p-6 flex flex-col">
        <Link to={`/posts/${postID}`} className="flex-1">
          <h2
            className={`text-xl font-bold mb-3 
            ${isDarkMode ? "text-detailed-text" : "text-default-text"}
            hover:text-orange-500 transition-colors`}
          >
            {title}
          </h2>
          <p
            className={`text-sm line-clamp-3
            ${isDarkMode ? "text-detailed-text/80" : "text-default-text/80"}`}
          >
            {content.replace(/<[^>]+>/g, "")}
          </p>
        </Link>

        {/* 作者信息固定在底部 */}
        <div className="mt-4 pt-4 border-t border-current/10">
          <PostAuthor authorID={authorID} />
        </div>
      </div>

      {/* 装饰性元素 */}
      <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-current rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
    </article>
  );
};

export default PostItem;
