export interface User {
  userId: string;
  email: string;
  username: string;
  token: string;
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
