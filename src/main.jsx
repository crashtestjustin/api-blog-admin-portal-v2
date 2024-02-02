import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./components/home/home.jsx";
import About from "./components/about/about.jsx";
import Posts from "./components/posts/posts.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: "",
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/posts",
        element: <Posts />,
      },
      {
        path: "/about",
        element: <About />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
