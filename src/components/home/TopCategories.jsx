import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import styles from "./TopCategories.module.css";

import furnitureImg from "../../assets/categories/furniture.png";
import handbagImg from "../../assets/categories/handbag.png";
import booksImg from "../../assets/categories/books.png";
import techImg from "../../assets/categories/tech.png";
import sneakersImg from "../../assets/categories/sneakers.png";
import travelImg from "../../assets/categories/travel.png";

const CARDS = [
  { key: "furniture", slug: "furniture", image: furnitureImg },
  { key: "handbags", slug: "womens-bags", image: handbagImg },
  { key: "books", slug: "books", image: booksImg },
  { key: "tech", slug: "smartphones", image: techImg },
  { key: "sneakers", slug: "mens-shoes", image: sneakersImg },
  { key: "travel", slug: "travel", image: travelImg },
];

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
  const cards = useMemo(() => CARDS, []);

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
            {cards.map((card) => (
              <motion.div key={card.slug} variants={cardVariants}>
                <Link to={`/c/${card.slug}`} className={styles.card}>
                  <img src={card.image} alt="" className={styles.image} />
                  <div className={styles.overlay} />
                  <div className={styles.shine} />
                  <p className={styles.cardTitle}>
                    {t(`topCategories.items.${card.key}`)}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
