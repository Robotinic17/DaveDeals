import { Outlet } from "react-router-dom";
import Topbar from "../components/navigation/Topbar";
import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer";

export default function MainLayout() {
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
