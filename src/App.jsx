import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Category from "./pages/Category";
import Categories from "./pages/Categories";
import Deals from "./pages/Deals";
import WhatsNew from "./pages/WhatsNew";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import InfoPage from "./pages/InfoPage";
import About from "./pages/About";
import Careers from "./pages/Careers";
import NewsBlog from "./pages/NewsBlog";
import NewsPost from "./pages/NewsPost";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "c/:slug", element: <Category /> },
      { path: "categories", element: <Categories /> },
      { path: "about", element: <About /> },
      { path: "careers", element: <Careers /> },
      { path: "news", element: <NewsBlog /> },
      { path: "news/:slug", element: <NewsPost /> },
      { path: "help", element: <InfoPage pageKey="help" /> },
      { path: "press", element: <InfoPage pageKey="press" /> },
      { path: "locations", element: <InfoPage pageKey="locations" /> },
      { path: "brands", element: <InfoPage pageKey="brands" /> },
      { path: "partners", element: <InfoPage pageKey="partners" /> },
      { path: "guides", element: <InfoPage pageKey="guides" /> },
      { path: "whats-new", element: <WhatsNew /> },
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
