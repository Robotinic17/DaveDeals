import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import styles from "./TopCategories.module.css";

import { useUnsplashImage } from "../../hooks/useUnsplashImage";

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

export default function TopCategories() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/data/categories.top.json");
        if (!res.ok) throw new Error("Failed to load top categories");
        const data = await res.json();
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

  function CategoryCard({ category }) {
    const { image } = useUnsplashImage(
      `${category.name} category product`,
      `topcat-${category.slug}`
    );

    return (
      <motion.div variants={cardVariants}>
        <div className={styles.cardWrap}>
          <Link to={`/c/${category.slug}`} className={styles.card}>
            <div className={styles.imageFallback} />
            {image?.url && (
              <img
                src={image.url}
                alt=""
                className={styles.image}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            <div className={styles.overlay} />
            <div className={styles.shine} />
            <p className={styles.cardTitle}>{category.name}</p>
          </Link>
          {image && (
            <p className={styles.credit}>
              Photo by{" "}
              <a href={image.userLink} target="_blank" rel="noreferrer">
                {image.name}
              </a>{" "}
              on{" "}
              <a href={image.unsplashLink} target="_blank" rel="noreferrer">
                Unsplash
              </a>
            </p>
          )}
        </div>
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
            <h2 className={styles.title}>{t("topCategories.title")}</h2>
            <p className={styles.sub}>{t("topCategories.subtitle")}</p>
          </div>

          <div className={styles.grid}>
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
