import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import styles from "./BestDeals.module.css";

import RatingStars from "../category/RatingStars";
import { getAllProducts } from "../../lib/catalog";

function clampRating(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(5, n));
}

export default function BestDeals() {
  const [products, setProducts] = useState([]);
  const [liked, setLiked] = useState(() => new Set());

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const items = await getAllProducts();
        if (!active) return;
        setProducts(Array.isArray(items) ? items : []);
      } catch (e) {
        if (!active) return;
        setProducts([]);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const deals = useMemo(() => {
    const MAX_DEALS = 24;
    const byCategory = new Map();
    for (const product of products) {
      const key = product.categorySlug || product.category || "misc";
      if (!byCategory.has(key)) byCategory.set(key, []);
      byCategory.get(key).push(product);
    }

    const groups = [...byCategory.values()];
    const result = [];
    let idx = 0;
    while (result.length < MAX_DEALS && groups.some((g) => g.length)) {
      const group = groups[idx % groups.length];
      if (group.length) {
        result.push(group.shift());
      }
      idx += 1;
    }
    return result;
  }, [products]);

  function toggleLike(id) {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>Todays Best Deals For You!</h2>
          <p className={styles.sub}>
            Handpicked finds with standout value, updated daily.
          </p>
        </div>
      </div>

      <div className={styles.scroller} role="list">
        {deals.map((p, idx) => {
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
            <motion.div
              key={id}
              className={styles.card}
              role="listitem"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: idx * 0.02 }}
            >
              <Link to={`/p/${id}`} className={styles.cardLink}>
                <button
                  type="button"
                  className={`${styles.heartBtn} ${
                    liked.has(id) ? styles.hearted : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleLike(id);
                  }}
                  aria-label="Favorite"
                >
                  <Heart size={18} />
                </button>

                <div className={styles.media}>
                  <img
                    src={imgSrc || "/fallback-product.png"}
                    alt={p.title || "Product"}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/fallback-product.png";
                    }}
                  />
                </div>

                <div className={styles.body}>
                  <div className={styles.row}>
                    <h3 className={styles.name}>{p.title}</h3>
                    <span className={styles.price}>
                      {Number.isFinite(price) ? `$${price}` : "$?"}
                    </span>
                  </div>
                  <p className={styles.meta}>
                    {p.category || "Top pick"}
                  </p>
                  <div className={styles.ratingRow}>
                    <RatingStars value={rating} />
                    <span className={styles.ratingText}>
                      ({rating.toFixed(1)})
                    </span>
                  </div>
                  <button type="button" className={styles.addBtn}>
                    Add to cart
                  </button>
                </div>
              </Link>
            </motion.div>
          );
        })}

        <div className={styles.endCard} aria-label="End of deals">
          <p>That&apos;s all best deals for today.</p>
          <span>Check back tomorrow.</span>
        </div>
      </div>
    </section>
  );
}
