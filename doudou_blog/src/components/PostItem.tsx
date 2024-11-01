import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor";

interface PostItemProps {
  postID: string;
  category: string;
  title: string;
  description: string;
  authorID: number;
  thumbnail: string;
}

const PostItem: React.FC<PostItemProps> = ({
  postID,
  category,
  title,
  description,
  authorID,
  thumbnail,
}) => {
  return (
    <article className="bg-white p-4 rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      <div
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${thumbnail})` }}
      >
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover opacity-0"
        />
      </div>
      <div className="p-2 flex flex-col flex-grow">
        <Link to={`/posts/${postID}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
            {title}
          </h3>
        </Link>
        <p className="text-gray-700 mb-4 flex-grow">{description}</p>
        <div className="flex items-center justify-between mt-auto">
          <PostAuthor authorID={authorID} />
          <Link
            to={`/posts/categories/${category}`}
            className="bg-gray-200 text-gray-700 py-2 px-2 rounded hover:bg-gray-300 transition duration-300 text-sm"
          >
            {category}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostItem;
