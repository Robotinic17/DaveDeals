import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Category from "./pages/Category";
import Deals from "./pages/Deals";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "c/:slug", element: <Category /> },
      { path: "deals/:type", element: <Deals /> },
      { path: "p/:id", element: <Product /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
