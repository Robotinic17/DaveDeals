import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import styles from "./Home.module.css";
import ScrollHero from "../components/home/ScrollHero";
import TopCategories from "../components/home/TopCategories";
import BestDeals from "../components/home/BestDeals";
import TopBrands from "../components/home/TopBrands";
import CategoryAds from "../components/home/CategoryAds";
import WeeklyPopular from "../components/home/WeeklyPopular";
import CashBackBanner from "../components/home/CashBackBanner";
import MostSelling from "../components/home/MostSelling";
import TrendingProducts from "../components/home/TrendingProducts";
import BestSellingStore from "../components/home/BestSellingStore";
import ServicesHelp from "../components/home/ServicesHelp";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main>
      <ScrollHero
        onExitViewport={(exited) => {
          window.__davedeals_heroExited = exited;
          window.dispatchEvent(
            new CustomEvent("heroExited", { detail: { exited } }),
          );
        }}
      />

      <section
        style={{
          position: "relative",
          zIndex: 1,
          background: "var(--bg, #fafaf8)",
        }}
      >
        <TopCategories />
        <BestDeals />
        <TopBrands />
        <CategoryAds />
        <WeeklyPopular />
        <CashBackBanner />
        <MostSelling />
        <TrendingProducts />
        <BestSellingStore />
        <ServicesHelp />
      </section>
    </main>
  );
}
