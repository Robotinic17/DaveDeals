import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import styles from "./Categories.module.css";

import { useUnsplashImage } from "../hooks/useUnsplashImage";

const COLOR_PALETTE = [
  "#F2EDE7",
  "#E8F3F1",
  "#F4EFE6",
  "#EAE9F7",
  "#F7EFEA",
  "#E7F0F7",
];

function colorForSlug(slug = "") {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) % COLOR_PALETTE.length;
  }
  return COLOR_PALETTE[hash] || COLOR_PALETTE[0];
}

function CategoryCard({ category }) {
  const { image } = useUnsplashImage(
    `${category.name} category product`,
    `category-${category.slug}`
  );

  return (
    <motion.div
      className={styles.cardWrap}
      style={{ "--card-accent": colorForSlug(category.slug) }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={`/c/${category.slug}`} className={styles.card}>
        <div className={styles.cardMedia}>
          {image?.url ? (
            <img src={image.url} alt="" className={styles.cardImg} />
          ) : (
            <div className={styles.cardInitial}>
              {category.name.slice(0, 1)}
            </div>
          )}
        </div>
        <div className={styles.cardBody}>
          <h3 className={styles.cardTitle}>{category.name}</h3>
          <p className={styles.cardMeta}>{category.count} items available</p>
        </div>
        <span className={styles.cardArrow}>View</span>
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
    </motion.div>
  );
}

export default function Categories() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch("/data/categories.enriched.json");
        if (!res.ok) throw new Error("Failed to load categories");
        const data = await res.json();
        if (!active) return;
        setCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!active) return;
        setError(true);
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

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return categories
      .filter((c) => (onlyAvailable ? c.count > 0 : true))
      .filter((c) => (needle ? c.name.toLowerCase().includes(needle) : true))
      .sort((a, b) => b.count - a.count);
  }, [categories, query, onlyAvailable]);

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <h1 className={styles.title}>Categories</h1>
            <p className={styles.sub}>
              Explore everything in the catalog. Tap a category to jump in.
            </p>
          </div>

          <div className={styles.searchWrap}>
            <Search size={18} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search categories"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="button"
              className={`${styles.toggleBtn} ${
                onlyAvailable ? styles.toggleActive : ""
              }`}
              onClick={() => setOnlyAvailable((v) => !v)}
            >
              {onlyAvailable ? "In stock" : "Show all"}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.inner}>
        {error && <p className={styles.error}>{t("category.loadError")}</p>}

        {loading && (
          <div className={styles.grid}>
            {Array.from({ length: 12 }).map((_, idx) => (
              <div key={idx} className={styles.skeletonCard} />
            ))}
          </div>
        )}

        {!loading && !error && (
          <div className={styles.grid}>
            {filtered.length === 0 && (
              <div className={styles.emptyCard}>
                <h3>No categories found</h3>
                <p>Try a different search or show all categories.</p>
              </div>
            )}
            {filtered.map((cat) => (
              <CategoryCard key={cat.slug} category={cat} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
