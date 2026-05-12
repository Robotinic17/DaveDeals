import { Outlet, useLocation } from "react-router-dom";
import Topbar from "../components/navigation/Topbar";
import Navbar from "../components/navigation/Navbar";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import Footer from "../components/navigation/Footer";
import ScrollToTopButton from "../components/ui/ScrollToTopButton";
import { useEffect, useState } from "react";
import i18n from "i18next";

export default function MainLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [scrollPast20, setScrollPast20] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = window.innerHeight * 0.2; // 20% of viewport
      setScrollPast20(scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {!isHome && <Topbar visible={scrollPast20} />}
      {!isHome && <Navbar scrolled={scrollPast20} />}
      <Breadcrumbs />
      <main style={{ width: "100%", margin: "0 auto", padding: "0" }}>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
    </>
  );
}
