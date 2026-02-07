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
import Help from "./pages/Help";
import PressCenter from "./pages/PressCenter";
import Locations from "./pages/Locations";
import Brands from "./pages/Brands";
import Partners from "./pages/Partners";
import Guides from "./pages/Guides";
import GiftCards from "./pages/GiftCards";
import MobileApp from "./pages/MobileApp";
import ShippingDelivery from "./pages/ShippingDelivery";
import OrderPickup from "./pages/OrderPickup";
import AccountSignup from "./pages/AccountSignup";

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
      { path: "help", element: <Help /> },
      { path: "press", element: <PressCenter /> },
      { path: "locations", element: <Locations /> },
      { path: "brands", element: <Brands /> },
      { path: "partners", element: <Partners /> },
      { path: "guides", element: <Guides /> },
      { path: "gift-cards", element: <GiftCards /> },
      { path: "mobile-app", element: <MobileApp /> },
      { path: "shipping-delivery", element: <ShippingDelivery /> },
      { path: "order-pickup", element: <OrderPickup /> },
      { path: "account-signup", element: <AccountSignup /> },
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
