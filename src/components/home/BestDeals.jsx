import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import styles from "./BestDeals.module.css";

import RatingStars from "../category/RatingStars";
import { getAllProducts } from "../../lib/catalog";
import { getProductImage } from "../../lib/productImages";
import { useInView } from "../../hooks/useInView";

function clampRating(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(5, n));
}

function getDayKey(date = new Date()) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function createSeededRandom(seed) {
  let state = seed >>> 0;
  return function random() {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function shuffleWithRand(list, rand) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function BestDeals() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [liked, setLiked] = useState(() => new Set());
  const { ref, inView } = useInView();

  useEffect(() => {
    let active = true;
    if (!inView) return () => {};

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
  }, [inView]);

  const deals = useMemo(() => {
    const MAX_DEALS = 24;
    const dayKey = getDayKey();
    const rand = createSeededRandom(hashString(`best-deals:${dayKey}`));
    const byCategory = new Map();
    for (const product of products) {
      const key = product.categorySlug || product.category || "misc";
      if (!byCategory.has(key)) byCategory.set(key, []);
      byCategory.get(key).push(product);
    }

    const groups = shuffleWithRand(
      [...byCategory.values()].map((group) => shuffleWithRand(group, rand)),
      rand,
    );
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
    <section className={styles.section} ref={ref}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t("home.bestDeals.title")}</h2>
          <p className={styles.sub}>{t("home.bestDeals.subtitle")}</p>
        </div>
      </div>

      <div className={styles.scroller} role="list">
        {deals.map((p, idx) => {
          const id = p.id || p.asin;
          if (!id) return null;
          const rating = clampRating(p.rating);
          const price = typeof p.price === "number" ? p.price : Number(p.price);
          const imgSrc = getProductImage(p);

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
                  aria-label={t("common.favorite")}
                >
                  <Heart size={18} />
                </button>

                <div className={styles.media}>
                  <img
                    src={imgSrc || "/fallback-product.png"}
                    alt={p.title || t("common.product")}
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
                      {Number.isFinite(price) ? `$${price}` : t("common.priceNA")}
                    </span>
                  </div>
                  <p className={styles.meta}>
                    {p.category || t("common.topPick")}
                  </p>
                  <div className={styles.ratingRow}>
                    <RatingStars value={rating} />
                    <span className={styles.ratingText}>
                      ({rating.toFixed(1)})
                    </span>
                  </div>
                  <button type="button" className={styles.addBtn}>
                    {t("common.addToCart")}
                  </button>
                </div>
              </Link>
            </motion.div>
          );
        })}

        <div className={styles.endCard} aria-label={t("home.bestDeals.endAria")}> 
          <p>{t("home.bestDeals.endTitle")}</p>
          <span>{t("home.bestDeals.endSubtitle")}</span>
        </div>
      </div>
    </section>
  );
}
