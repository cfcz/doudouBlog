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
import Authors from "./pages/Authors.tsx";
import CreatePost from "./pages/CreatePost.tsx";
import CategoryPost from "./pages/CategoryPost.tsx";
import AuthorPosts from "./pages/AuthorPosts.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import EditPost from "./pages/EditPost.tsx";
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
      { path: "posts/:id", element: <PostDetail /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "profile", element: <UserProfile /> },
      { path: "authors", element: <Authors /> },
      { path: "create", element: <CreatePost /> },
      { path: "register", element: <Register /> },
      { path: "posts/categories/:category", element: <CategoryPost /> },
      { path: "posts/users/:id", element: <AuthorPosts /> },
      { path: "myposts/:id", element: <Dashboard /> },
      { path: "posts/:id/edit", element: <EditPost /> },
      { path: "logout", element: <Logout /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={BrowserRouter} />
  </StrictMode>
);
