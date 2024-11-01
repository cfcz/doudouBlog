import { useState } from "react";
import { useParams } from "react-router-dom";
import PostItem from "../components/PostItem";
import { DUMMY_POSTS } from "../data";

const AuthorPosts = () => {
  const { id } = useParams<{ id: string }>();
  const [posts] = useState(DUMMY_POSTS);

  // 过滤出 authorID 等于页面参数 id 的帖子
  const filteredPosts = id
    ? posts.filter((post) => post.authorID === parseInt(id, 10))
    : [];

  return (
    <section className="py-8 px-4 bg-gray-100">
      {filteredPosts.length > 0 ? (
        <div className="container mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredPosts.map(
            ({ id, thumbnail, category, title, desc, authorID }) => (
              <PostItem
                key={id}
                postID={id}
                thumbnail={thumbnail}
                category={category}
                title={title}
                description={desc}
                authorID={authorID}
              />
            )
          )}
        </div>
      ) : (
        <h2 className="text-center text-gray-700 text-xl">No posts found</h2>
      )}
    </section>
  );
};

export default AuthorPosts;
