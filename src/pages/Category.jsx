import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Heart, SlidersHorizontal, ChevronDown, Star } from "lucide-react";
import { motion } from "framer-motion";
import styles from "./Category.module.css";
import { getProductsByCategory } from "../services/products.service";
import PromoSlider from "../components/category/PromoSlider";
import RatingStars from "../components/category/RatingStars";

function formatCategoryTitle(slug) {
  if (!slug) return "";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function clampRating(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 4.5;
  return Math.max(0, Math.min(5, n));
}

export default function Category() {
  const { slug } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);

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

      setLoading(true);
      setError("");

      try {
        const data = await getProductsByCategory(slug);
        if (!isActive) return;

        setProducts(Array.isArray(data.products) ? data.products : []);
      } catch {
        if (!isActive) return;
        setError("Failed to load products.");
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

  return (
    <section className={styles.page}>
      <PromoSlider />

      <div className={styles.inner}>
        <div className={styles.filterRow}>
          <div className={styles.chips}>
            {[
              `${title} Type`,
              "Price",
              "Review",
              "Color",
              "Material",
              "Offer",
            ].map((label) => (
              <button key={label} type="button" className={styles.chip}>
                <span>{label}</span>
                <ChevronDown size={14} />
              </button>
            ))}

            <button type="button" className={styles.chipWide}>
              <span>All Filters</span>
              <SlidersHorizontal size={14} />
            </button>
          </div>

          <button type="button" className={styles.sortBtn}>
            <span>Sort by</span>
            <ChevronDown size={14} />
          </button>
        </div>

        <h1 className={styles.title}>{title} For You!</h1>

        {loading && <p className={styles.muted}>Loading products...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && (
          <div className={styles.grid}>
            {products.map((p, idx) => (
              <motion.article
                key={p.id}
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
                    likedIds.has(p.id) ? styles.hearted : ""
                  }`}
                  aria-label="Add to wishlist"
                  onClick={() => toggleLiked(p.id)}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart size={18} />
                  <span className={styles.heartShine} aria-hidden="true" />
                </motion.button>

                <div className={styles.media}>
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className={styles.thumb}
                  />
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.row}>
                    <p className={styles.name}>{p.title}</p>
                    <p className={styles.price}>${p.price}</p>
                  </div>

                  <p className={styles.desc}>{p.description}</p>

                  <div className={styles.ratingRow}>
                    <RatingStars value={p.rating} />
                    <span className={styles.ratingText}>
                      ({Number(p.rating || 0).toFixed(1)})
                    </span>
                  </div>

                  <motion.button
                    type="button"
                    className={`${styles.addBtn} ${
                      cartIds.has(p.id) ? styles.added : ""
                    }`}
                    onClick={() => toggleCart(p.id)}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className={styles.addBtnText}>
                      {cartIds.has(p.id) ? "Added" : "Add to Cart"}
                    </span>
                    <span className={styles.addShine} aria-hidden="true" />
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
