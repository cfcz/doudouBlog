import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PostAuthor = ({ authorID }: { authorID: number }) => {
  const [avatarPath, setAvatarPath] = useState<string>("");

  useEffect(() => {
    import(`../assets/avatar${authorID}.jpg`).then((module) =>
      setAvatarPath(module.default)
    ); // 动态生成头像路径
  }, [authorID]);

  return (
    <Link to={`/posts/users/${authorID}`} className="flex items-center">
      <img
        src={avatarPath}
        alt={`Author ${authorID}`}
        className="w-10 h-10 rounded-full mr-4"
      />
      <div>
        <p className="text-gray-900 font-bold text-sm">Author Name</p>
        <p className="text-gray-600 text-xs">Just now</p>
      </div>
    </Link>
  );
};

export default PostAuthor;
