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
