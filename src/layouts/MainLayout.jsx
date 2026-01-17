import { Outlet } from "react-router-dom";
import Topbar from "../components/navigation/Topbar";
import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer";
import { useEffect } from "react";
import i18n from "i18next";

export default function MainLayout() {
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, []);
  return (
    <>
      <Topbar />
      <Navbar />
      <main
        style={{
          width: "min(1100px, 92%)",
          margin: "0 auto",
          padding: "24px 0",
        }}
      >
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
