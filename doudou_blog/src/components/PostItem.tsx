import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor";

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
  // 获取第一张图片作为缩略图，如果没有则使用默认图片
  const thumbnail =
    mediaFiles && mediaFiles.length > 0
      ? mediaFiles.find((file) => file.type === "image")?.url
      : "/logo.png";

  // 处理标签显示
  const displayTags = tags && tags.length > 0 ? tags : ["未分类"];

  // 提取第一句话作为描述（简单的实现）
  const description =
    content
      .replace(/<[^>]*>/g, "") // 移除HTML标签
      .split(/[.!?。！？]/)[0] // 按句号分割并获取第一句
      .trim()
      .slice(0, 150) + "..."; // 限制长度

  return (
    <article className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      <div className="h-48 bg-cover bg-center relative rounded-lg overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/default-thumbnail.jpg";
          }}
        />
      </div>

      <div className="p-2 flex flex-col flex-grow">
        <Link to={`/posts/${postID}`}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-300 mb-2 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">
          {description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <PostAuthor authorID={authorID} />
          <div className="flex flex-wrap gap-2">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-orange-50 dark:bg-gray-700 text-orange-600 dark:text-orange-400 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostItem;
