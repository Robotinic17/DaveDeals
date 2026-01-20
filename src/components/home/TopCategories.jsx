import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import styles from "./TopCategories.module.css";

import { getCategoryImage } from "../../lib/pixabay";

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
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/data/categories.top.json");
        if (!res.ok) throw new Error("Failed to load top categories");
        const data = await res.json();
        if (!active) return;

        const next = Array.isArray(data) ? data : [];
        const withImages = await Promise.all(
          next.map(async (item) => {
            const image = await getCategoryImage(item.name, item.slug);
            return {
              slug: item.slug,
              label: item.name || item.slug,
              imageUrl: image?.url || "",
              credit: image
                ? {
                    name: image.user,
                    pageUrl: image.pageUrl,
                  }
                : null,
            };
          })
        );
        if (!active) return;
        setCards(withImages);
      } catch (e) {
        if (!active) return;
        setCards([]);
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
              cards.map((card) => (
              <motion.div key={card.slug} variants={cardVariants}>
                <div className={styles.cardWrap}>
                  <Link to={`/c/${card.slug}`} className={styles.card}>
                    <div className={styles.imageFallback} />
                    {card.imageUrl && (
                      <img
                        src={card.imageUrl}
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
                    <p className={styles.cardTitle}>{card.label}</p>
                  </Link>
                  {card.credit && (
                    <p className={styles.credit}>
                      Image by{" "}
                      <a
                        href={card.credit.pageUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {card.credit.name}
                      </a>{" "}
                      on{" "}
                      <a
                        href="https://pixabay.com"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Pixabay
                      </a>
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
            {!loading && cards.length === 0 && (
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
