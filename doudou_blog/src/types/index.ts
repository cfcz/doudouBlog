export interface Post {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  creator: {
    _id: string;
    username: string;
    email: string;
  };
  mediaFiles: Array<{
    url: string;
    type: string;
    filename: string;
  }>;
  // 添加点赞和收藏相关字段
  likes: Array<string>; // 点赞用户的ID数组
  likesCount: number;
  isLiked?: boolean; // 当前用户是否点赞
  favorites: Array<string>; // 收藏用户的ID数组
  favoritesCount: number;
  isFavorited?: boolean; // 当前用户是否收藏
  createdAt: string;
  updatedAt: string;
}

export interface Layout {
  theme: string;
  sidebarPosition: "left" | "right";
  components: Array<{
    id: string;
    name: string;
    icon: string;
    column: "left" | "right";
    order: number;
  }>;
}

export interface Comment {
  _id: string;
  content: string;
  post: string;
  author: {
    _id: string;
    username: string;
    email: string;
  };
  parentComment: Comment | null;
  rootComment: string | null;
  likes: Array<{
    _id: string;
    username: string;
  }>;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  replies: Comment[] | [];
  likeCount?: number;
}

export interface CommentProps {
  postId: string;
  token: string;
  userId: string;
}

export interface Author {
  _id: string;
  username: string;
  email: string;
}
