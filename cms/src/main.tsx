import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "./index.css";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import PublishPost from "./pages/PublishPost";
import ManagePosts from "./pages/ManagePosts";
import ThemeLayout from "./pages/ThemeLayout";
import Status from "./pages/Status";
import Login from "./pages/Login";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "publish", element: <PublishPost /> },
      { path: "manage", element: <ManagePosts /> },
      { path: "theme", element: <ThemeLayout /> },
      { path: "status", element: <Status /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
