import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import styles from "./TopCategories.module.css";

import { getAllCategories, getPopulatedCategories } from "../../lib/catalog";
import { CATEGORY_OVERRIDES, resolveCategorySlug } from "../../lib/categoryResolver";
import headphoneImg from "../../assets/categories/headphone.jpg";
import techImg from "../../assets/categories/tech.png";
import travelImg from "../../assets/categories/travel.png";
import furnitureImg from "../../assets/categories/furniture.png";
import booksImg from "../../assets/categories/books.png";
import handbagImg from "../../assets/categories/handbag.png";

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const CATEGORY_VISUALS = {
  "headphones-and-earbuds": {
    image: headphoneImg,
    tone: "softStone",
    eyebrow: "Sound picks",
  },
  "cell-phones-and-accessories": {
    image: techImg,
    tone: "mintGlass",
    eyebrow: "Everyday tech",
  },
  "travel-accessories": {
    image: travelImg,
    tone: "sandMist",
    eyebrow: "Go anywhere",
  },
  "home-d-cor-products": {
    image: furnitureImg,
    tone: "oliveRoom",
    eyebrow: "Living spaces",
  },
  "kitchen-and-dining": {
    image: booksImg,
    tone: "cloudPlate",
    eyebrow: "Table essentials",
  },
  "home-storage-and-organization": {
    image: handbagImg,
    tone: "terracottaShelf",
    eyebrow: "Tidy living",
  },
};

export default function TopCategories() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      try {
        const data = await getPopulatedCategories(8);
        if (!active) return;
        setCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!active) return;
        setCategories([]);
      } finally {
        if (!active) return;
        setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadAll() {
      try {
        const items = await getAllCategories();
        if (!active) return;
        setAllCategories(Array.isArray(items) ? items : []);
      } catch (e) {
        if (!active) return;
        setAllCategories([]);
      }
    }

    loadAll();

    return () => {
      active = false;
    };
  }, []);

  function CategoryCard({ category }) {
    const resolvedSlug =
      resolveCategorySlug(
        { slug: category.slug, name: category.name },
        allCategories,
        CATEGORY_OVERRIDES,
      ) || category.slug;
    const visual = CATEGORY_VISUALS[category.slug] || {};
    const countLabel =
      typeof category.count === "number"
        ? `${category.count.toLocaleString()} live picks`
        : "Browse now";

    return (
      <motion.div
        variants={cardVariants}
        className={`${styles.cardWrap} ${styles[visual.tone] || ""}`}
      >
        <Link to={`/c/${resolvedSlug}`} className={styles.card}>
          <div className={styles.visual}>
            {visual.image ? (
              <img src={visual.image} alt="" className={styles.image} loading="lazy" />
            ) : (
              <div className={styles.imageFallback} />
            )}
          </div>

          <div className={styles.content}>
            <p className={styles.eyebrow}>{visual.eyebrow || "Top category"}</p>
            <h3 className={styles.cardTitle}>{category.name}</h3>
            <p className={styles.countText}>{countLabel}</p>
            <span className={styles.openBadge}>
              Explore <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className={styles.header}>
            <div>
              <p className={styles.kicker}>Curated categories</p>
              <h2 className={styles.title}>{t("topCategories.title")}</h2>
            </div>
            <div className={styles.headerSide}>
              <p className={styles.sub}>{t("topCategories.subtitle")}</p>
              <Link to="/categories" className={styles.headerLink}>
                See all categories
              </Link>
            </div>
          </div>

          <div className={styles.scroller}>
            {loading &&
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className={styles.skeletonCard} />
              ))}
            {!loading &&
              categories.map((category) => (
                <CategoryCard key={category.slug} category={category} />
              ))}
            {!loading && categories.length === 0 && (
              <div className={styles.emptyState}>
                Top categories are unavailable right now.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
