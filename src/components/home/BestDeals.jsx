import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Heart, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import styles from "./BestDeals.module.css";

import RatingStars from "../category/RatingStars";
import { getAllProducts } from "../../lib/catalog";
import { getProductImage } from "../../lib/productImages";
import { useInView } from "../../hooks/useInView";
import { addToCart, loadCart, removeFromCart } from "../../lib/cart";
import { formatNaira } from "../../lib/currency";

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
  const [cartIds, setCartIds] = useState(() => {
    const cart = loadCart();
    return new Set(cart.map((item) => String(item.id)));
  });
  const { ref, inView } = useInView();

  // Sync cart with localStorage changes
  useEffect(() => {
    const interval = setInterval(() => {
      const cart = loadCart();
      setCartIds(new Set(cart.map((item) => String(item.id))));
    }, 500);
    return () => clearInterval(interval);
  }, []);

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

  function toggleCart(id, product) {
    if (cartIds.has(id)) {
      removeFromCart(id);
    } else {
      addToCart({
        id: product.id,
        title: product.title,
        price:
          typeof product.price === "number"
            ? product.price
            : Number(product.price),
        currency: product.currency || "USD",
        thumbnail: getProductImage(product),
      });
    }
    const cart = loadCart();
    setCartIds(new Set(cart.map((item) => String(item.id))));
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
                    e.stopPropagation();
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
                  <p className={styles.categoryBadge}>
                    {p.category || t("common.topPick")}
                  </p>
                  <h3 className={styles.name}>{p.title}</h3>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>
                      {formatNaira(price, t("common.priceNA"))}
                    </span>
                    <button
                      type="button"
                      className={`${styles.addBtn} ${
                        cartIds.has(id) ? styles.added : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleCart(id, p);
                      }}
                      aria-label={
                        cartIds.has(id)
                          ? t("category.added")
                          : t("common.addToCart")
                      }
                    >
                      {cartIds.has(id) ? (
                        <Check aria-hidden="true" />
                      ) : (
                        <Plus aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  <div className={styles.ratingRow}>
                    <RatingStars value={rating} />
                    <span className={styles.ratingText}>
                      ({rating.toFixed(1)})
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}

        <div
          className={styles.endCard}
          aria-label={t("home.bestDeals.endAria")}
        >
          <p>{t("home.bestDeals.endTitle")}</p>
          <span>{t("home.bestDeals.endSubtitle")}</span>
        </div>
      </div>
    </section>
  );
}
