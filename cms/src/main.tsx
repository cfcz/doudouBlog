import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import PublishPost from "./pages/PublishPost";
import ManagePosts from "./pages/ManagePosts";
import ThemeLayout from "./pages/ThemeLayout";
import Status from "./pages/Status";
import Login from "./pages/Login";
import { GlobalProvider } from "./context/GlobalContexts"; // 引入自定义的上下文提供者
import PrivateRoutes from "./components/PrivateRoutes"; // 引入路由守卫

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <GlobalProvider>
        <PrivateRoutes>
          {/* 路由守卫 */}
          <Layout />
        </PrivateRoutes>
      </GlobalProvider>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "publish", element: <PublishPost /> },
      { path: "manage", element: <ManagePosts /> },
      { path: "theme", element: <ThemeLayout /> },
      { path: "status", element: <Status /> },
    ],
  },
  {
    path: "/login",
    element: (
      <GlobalProvider>
        <Login />
      </GlobalProvider>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
