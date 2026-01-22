import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import styles from "./Categories.module.css";

import { getCategoryImage } from "../lib/pixabay";

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

  const [images, setImages] = useState({});

  useEffect(() => {
    let active = true;

    async function loadImages() {
      if (!filtered.length) return;
      const entries = await Promise.all(
        filtered.map(async (cat) => {
          const image = await getCategoryImage(cat.name, cat.slug);
          return [
            cat.slug,
            image
              ? {
                  url: image.url,
                  name: image.user,
                  pageUrl: image.pageUrl,
                }
              : null,
          ];
        })
      );
      if (!active) return;
      const next = {};
      for (const [slug, data] of entries) next[slug] = data;
      setImages(next);
    }

    loadImages();

    return () => {
      active = false;
    };
  }, [filtered]);

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
            {filtered.map((cat) => {
              const img = images[cat.slug];
              const bg = colorForSlug(cat.slug);
              return (
                <motion.div
                  key={cat.slug}
                  className={styles.cardWrap}
                  style={{ "--card-accent": bg }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to={`/c/${cat.slug}`} className={styles.card}>
                    <div className={styles.cardMedia}>
                      {img?.url ? (
                        <img src={img.url} alt="" className={styles.cardImg} />
                      ) : (
                        <div className={styles.cardInitial}>
                          {cat.name.slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <div className={styles.cardBody}>
                      <h3 className={styles.cardTitle}>{cat.name}</h3>
                      <p className={styles.cardMeta}>
                        {cat.count} items available
                      </p>
                    </div>
                    <span className={styles.cardArrow}>View</span>
                  </Link>
                  {img && (
                    <p className={styles.credit}>
                      Image by{" "}
                      <a href={img.pageUrl} target="_blank" rel="noreferrer">
                        {img.name}
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
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
