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
  parentComment: string | null;
  likes: Array<{
    _id: string;
    username: string;
  }>;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
  likeCount?: number;
}

export interface CommentProps {
  postId: string;
  token: string;
  userId: string;
}
