import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import Home from "./pages/Home.tsx";
import PostDetail from "./pages/PostDetail.tsx";
import Register from "./pages/Register.tsx";
import Login from "./pages/Login.tsx";
import UserProfile from "./pages/UserProfile.tsx";
import CategoryPost from "./pages/CategoryPost.tsx";
import AuthorPosts from "./pages/AuthorPosts.tsx";
import Logout from "./pages/Logout.tsx";

import store from "./store/index.ts";
import { Provider } from "react-redux";

const BrowserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <Provider store={store}>
        <Layout />
      </Provider>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "posts/:id", element: <PostDetail /> }, //查看某篇内容
      { path: "register", element: <Register /> }, //注册-简略版本
      { path: "login", element: <Login /> }, //登录-简略版本
      { path: "profile/:userId", element: <UserProfile /> }, // 修改为用户详情页路由
      { path: "posts/categories/:category", element: <CategoryPost /> }, //分类的文章
      { path: "posts/users/:id", element: <AuthorPosts /> }, //个人的文章展示不确定现在要不要
      { path: "logout", element: <Logout /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={BrowserRouter} />
  </StrictMode>
);
