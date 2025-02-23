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
import Logout from "./pages/Logout.tsx";
import { GlobalProvider } from "./contexts/GlobalContexts.tsx"; // 引入自定义的上下文提供者

const BrowserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <GlobalProvider>
        <Layout />
      </GlobalProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "posts/:id", element: <PostDetail /> }, //查看某篇内容
      { path: "register", element: <Register /> }, //注册-简略版本
      { path: "login", element: <Login /> }, //登录-简略版本
      { path: "profile/:userId", element: <UserProfile /> }, // 修改为用户详情页路由
      { path: "logout", element: <Logout /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={BrowserRouter} />
  </StrictMode>
);
