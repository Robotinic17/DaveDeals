import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import styles from "./WhatsNew.module.css";

import RatingStars from "../components/category/RatingStars";
import { getAllProducts } from "../lib/catalog";
import { getProductImage } from "../lib/productImages";

const PAGE_SIZE = 70;
const MAX_PAGES = 5;

function clampRating(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(5, n));
}

export default function WhatsNew() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(false);
      try {
        const items = await getAllProducts();
        if (!active) return;
        const ordered = Array.isArray(items) ? [...items].reverse() : [];
        setProducts(ordered);
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

  const maxItems = PAGE_SIZE * MAX_PAGES;
  const pagedProducts = useMemo(
    () => products.slice(0, maxItems),
    [products, maxItems]
  );

  const totalPages = useMemo(() => {
    const pages = Math.ceil(pagedProducts.length / PAGE_SIZE);
    return Math.max(1, pages);
  }, [pagedProducts.length]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const shownProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return pagedProducts.slice(start, start + PAGE_SIZE);
  }, [pagedProducts, currentPage]);

  const pageItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const items = [1];
    const left = Math.max(2, currentPage - 1);
    const right = Math.min(totalPages - 1, currentPage + 1);
    if (left > 2) items.push("gap-left");
    for (let i = left; i <= right; i += 1) items.push(i);
    if (right < totalPages - 1) items.push("gap-right");
    items.push(totalPages);
    return items;
  }, [currentPage, totalPages]);

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <p className={styles.kicker}>{t("nav.whatsNew")}</p>
            <h1 className={styles.title}>New arrivals</h1>
            <p className={styles.sub}>
              Fresh drops curated from across the catalog. Updated as inventory
              flows in.
            </p>
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
          <>
            <div className={styles.grid}>
              {shownProducts.map((p, idx) => {
                const id = p.id || p.asin;
                if (!id) return null;

                const rating = clampRating(p.rating);
                const price =
                  typeof p.price === "number" ? p.price : Number(p.price);

                const imgSrc = getProductImage(p);

                return (
                  <motion.article
                    key={id}
                    className={styles.card}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                      delay: Math.min(idx * 0.02, 0.2),
                    }}
                  >
                    <Link to={`/p/${id}`} className={styles.cardLink}>
                    <div className={styles.badge}>New</div>
                    <div className={styles.media}>
                      <img
                        src={imgSrc || "/fallback-product.png"}
                        alt={p.title || "Product"}
                        className={styles.thumb}
                        loading="lazy"
                        referrerPolicy="origin"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/fallback-product.png";
                        }}
                      />
                    </div>
                    <div className={styles.cardBody}>
                      <p className={`${styles.name} ${styles.clamp2}`}>
                        {p.title}
                      </p>
                      <div className={styles.row}>
                        <p className={styles.price}>
                          {Number.isFinite(price) ? `$${price}` : "$?"}
                        </p>
                        <div className={styles.ratingRow}>
                          <RatingStars value={rating} />
                          <span className={styles.ratingText}>
                            ({rating.toFixed(1)})
                          </span>
                        </div>
                      </div>
                      <p className={styles.meta}>
                        {p.category || "New arrivals"}
                      </p>
                    </div>
                    </Link>
                  </motion.article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  type="button"
                  className={styles.pageBtn}
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  {"<<"}
                </button>
                <button
                  type="button"
                  className={styles.pageBtn}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  {"<"}
                </button>
                {pageItems.map((item) =>
                  typeof item === "number" ? (
                    <button
                      key={item}
                      type="button"
                      className={`${styles.pageBtn} ${
                        item === currentPage ? styles.pageActive : ""
                      }`}
                      onClick={() => setCurrentPage(item)}
                    >
                      {item}
                    </button>
                  ) : (
                    <span key={item} className={styles.pageGap}>
                      ...
                    </span>
                  )
                )}
                <button
                  type="button"
                  className={styles.pageBtn}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  {">"}
                </button>
                <button
                  type="button"
                  className={styles.pageBtn}
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  {">>"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
