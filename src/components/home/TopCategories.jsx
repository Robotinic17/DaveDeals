import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import styles from "./TopCategories.module.css";

import headphoneImg from "../../assets/categories/headphone.jpg";
import techImg from "../../assets/categories/tech.png";
import travelImg from "../../assets/categories/travel.png";
import furnitureImg from "../../assets/categories/furniture.png";
import booksImg from "../../assets/categories/books.png";
import handbagImg from "../../assets/categories/handbag.png";

const CURATED_CATEGORIES = [
  {
    slug: "headphones-and-earbuds",
    title: "Headphones & Audio",
    eyebrow: "Sound picks",
    image: headphoneImg,
    tone: "softStone",
  },
  {
    slug: "cell-phones-and-accessories",
    title: "Phones & Accessories",
    eyebrow: "Everyday tech",
    image: techImg,
    tone: "mintGlass",
  },
  {
    slug: "travel-accessories",
    title: "Travel Accessories",
    eyebrow: "Go anywhere",
    image: travelImg,
    tone: "sandMist",
  },
  {
    slug: "home-d-cor-products",
    title: "Home & Furniture",
    eyebrow: "Living spaces",
    image: furnitureImg,
    tone: "oliveRoom",
  },
  {
    slug: "kitchen-and-dining",
    title: "Kitchen & Dining",
    eyebrow: "Table essentials",
    image: booksImg,
    tone: "cloudPlate",
  },
  {
    slug: "home-storage-and-organization",
    title: "Storage & Organizing",
    eyebrow: "Tidy living",
    image: handbagImg,
    tone: "terracottaShelf",
  },
];

export default function TopCategories() {
  const { t } = useTranslation();

  return (
    <section className={styles.section} aria-labelledby="top-categories-title">
      <div className={styles.inner}>
        <div className={styles.header}>
          <div>
            <p className={styles.kicker}>Curated categories</p>
            <h2 id="top-categories-title" className={styles.title}>
              {t("topCategories.title")}
            </h2>
          </div>
          <div className={styles.headerSide}>
            <p className={styles.sub}>{t("topCategories.subtitle")}</p>
            <Link to="/categories" className={styles.headerLink}>
              Shop all categories
            </Link>
          </div>
        </div>

        <div className={styles.grid}>
          {CURATED_CATEGORIES.map((category, index) => (
            <Link
              key={category.slug}
              to={`/c/${category.slug}`}
              className={`${styles.card} ${styles[category.tone] || ""}`}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className={styles.visual}>
                <img
                  src={category.image}
                  alt=""
                  className={styles.image}
                  loading="lazy"
                />
              </div>

              <div className={styles.content}>
                <p className={styles.eyebrow}>{category.eyebrow}</p>
                <h3 className={styles.cardTitle}>{category.title}</h3>
                <span className={styles.openBadge}>
                  Explore <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
