import { Outlet, useLocation } from "react-router-dom";
import Topbar from "../components/navigation/Topbar";
import Navbar from "../components/navigation/Navbar";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import Footer from "../components/navigation/Footer";
import ScrollToTopButton from "../components/ui/ScrollToTopButton";
import { useEffect, useRef, useState } from "react";
import i18n from "i18next";

export default function MainLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [navVisible, setNavVisible] = useState(!isHome);
  const ticking = useRef(false);

  useEffect(() => {
    if (!isHome) {
      setNavVisible(true);
      return;
    }

    setNavVisible(false);

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          // Reveal navbar after passing most of the hero/header on home.
          setNavVisible(window.scrollY > window.innerHeight * 0.9);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, []);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 210,
        }}
      >
        <Topbar />
      </div>

      <div
        style={{
          position: "fixed",
          top: "var(--topbar-offset, 40px)",
          left: 0,
          right: 0,
          zIndex: 200,
          transform: navVisible ? "translateY(0)" : "translateY(-110%)",
          transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform",
        }}
      >
        <Navbar />
      </div>

      {/* Keep topbar offset always; add navbar offset only when it's shown or not on home. */}
      <div
        style={{
          height: isHome
            ? "var(--topbar-offset, 40px)"
            : "var(--nav-offset, 108px)",
        }}
      />

      <Breadcrumbs />
      <main style={{ width: "100%", margin: "0 auto", padding: "0" }}>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
    </>
  );
}
