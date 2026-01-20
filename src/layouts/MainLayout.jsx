import { Outlet, useLocation } from "react-router-dom";
import Topbar from "../components/navigation/Topbar";
import Navbar from "../components/navigation/Navbar";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import Footer from "../components/navigation/Footer";
import { useEffect } from "react";
import i18n from "i18next";

export default function MainLayout() {
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <>
      <Topbar />
      <Navbar />
      <Breadcrumbs />
      <main
        style={{
          width: "100%",
          margin: "0 auto",
          padding: " 0",
        }}
      >
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
