import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart, SlidersHorizontal, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import styles from "./Category.module.css";

import PromoSlider from "../components/category/PromoSlider";
import RatingStars from "../components/category/RatingStars";
import { getProductsByCategorySlug } from "../lib/catalog";

function formatCategoryTitle(slug) {
  if (!slug) return "";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function clampRating(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(5, n));
}

const PAGE_SIZE = 50;

export default function Category() {
  const { slug } = useParams();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState([]);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const title = useMemo(() => formatCategoryTitle(slug), [slug]);

  const [likedIds, setLikedIds] = useState(() => new Set());
  const [cartIds, setCartIds] = useState(() => new Set());

  function toggleLiked(id) {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleCart(id) {
    setCartIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  useEffect(() => {
    let isActive = true;

    async function load() {
      if (!slug) return;

      setVisibleCount(PAGE_SIZE);
      setLoading(true);
      setError(false);

      try {
        const items = await getProductsByCategorySlug(slug);
        if (!isActive) return;

        setProducts(Array.isArray(items) ? items : []);
      } catch (e) {
        if (!isActive) return;
        setError(true);
      } finally {
        if (!isActive) return;
        setLoading(false);
      }
    }

    load();

    return () => {
      isActive = false;
    };
  }, [slug]);

  const shownProducts = useMemo(
    () => products.slice(0, visibleCount),
    [products, visibleCount]
  );

  return (
    <section className={styles.page}>
      <PromoSlider />

      <div className={styles.inner}>
        <div className={styles.filterRow}>
          <div className={styles.chips}>
            {[
              t("category.chipType", { title }),
              t("category.price"),
              t("category.review"),
              t("category.color"),
              t("category.material"),
              t("category.offer"),
            ].map((label) => (
              <button key={label} type="button" className={styles.chip}>
                <span>{label}</span>
                <ChevronDown size={14} />
              </button>
            ))}

            <button type="button" className={styles.chipWide}>
              <span>{t("category.allFilters")}</span>
              <SlidersHorizontal size={14} />
            </button>
          </div>

          <button type="button" className={styles.sortBtn}>
            <span>{t("category.sortBy")}</span>
            <ChevronDown size={14} />
          </button>
        </div>

        <h1 className={styles.title}>{t("category.title", { title })}</h1>

        {loading && <p className={styles.muted}>{t("category.loading")}</p>}
        {error && <p className={styles.error}>{t("category.loadError")}</p>}

        {!loading && !error && (
          <>
            <div className={styles.grid}>
              {shownProducts.map((p, idx) => {
                const id = p.id || p.asin;
                if (!id) return null;

                const rating = clampRating(p.rating);
                const price =
                  typeof p.price === "number" ? p.price : Number(p.price);
                const imgSrc = (p.thumbnail || p.imgUrl || "").replace(
                  /^http:\/\//,
                  "https://"
                );

                return (
                  <motion.article
                    key={id}
                    className={styles.card}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      ease: "easeOut",
                      delay: Math.min(idx * 0.03, 0.25),
                    }}
                  >
                    <motion.button
                      type="button"
                      className={`${styles.heartBtn} ${
                        likedIds.has(id) ? styles.hearted : ""
                      }`}
                      aria-label={t("category.addWishlist")}
                      onClick={() => toggleLiked(id)}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart size={18} />
                      <span className={styles.heartShine} aria-hidden="true" />
                    </motion.button>

                    <div className={styles.media}>
                      <img
                        src={imgSrc || "/fallback-product.png"}
                        alt={p.title || "Product"}
                        className={styles.thumb}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          // stop loops (super important)
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/fallback-product.png";
                        }}
                      />
                    </div>

                    <div className={styles.cardBody}>
                      <div className={styles.row}>
                        <p className={`${styles.name} ${styles.clamp2}`}>
                          {p.title}
                        </p>
                        <p className={styles.price}>
                          {Number.isFinite(price) ? `$${price}` : "$—"}
                        </p>
                      </div>

                      <p className={`${styles.desc} ${styles.clamp2}`}>
                        {/* dataset doesn’t have description, so show category + reviews */}
                        {p.category || title}
                        {p.reviewsCount != null ? ` • (${p.reviewsCount})` : ""}
                      </p>

                      <div className={styles.ratingRow}>
                        <RatingStars value={rating} />
                        <span className={styles.ratingText}>
                          ({rating.toFixed(1)})
                        </span>
                      </div>

                      <motion.button
                        type="button"
                        className={`${styles.addBtn} ${
                          cartIds.has(id) ? styles.added : ""
                        }`}
                        onClick={() => toggleCart(id)}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className={styles.addBtnText}>
                          {cartIds.has(id)
                            ? t("category.added")
                            : t("category.addToCart")}
                        </span>
                        <span className={styles.addShine} aria-hidden="true" />
                      </motion.button>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            {products.length > visibleCount && (
              <button
                type="button"
                className={styles.seeMore}
                onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
              >
                {t("category.seeMore", { defaultValue: "See more" })}
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
