import { useEffect, useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./MostSelling.module.css";
import RatingStars from "../category/RatingStars";
import { useUnsplashImage } from "../../hooks/useUnsplashImage";
import { getAllProducts } from "../../lib/catalog";
import { useInView } from "../../hooks/useInView";
import { getProductImage } from "../../lib/productImages";

function clampRating(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(5, n));
}

function toHttps(url) {
  return String(url || "").replace(/^http:\/\//, "https://");
}

function getWeekKey(date = new Date()) {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
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

function pickWeeklyItems(list, count, weekKey) {
  if (!Array.isArray(list) || list.length === 0) return [];
  const rand = createSeededRandom(hashString(`most-selling:${weekKey}`));
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

function normalizeProduct(product, t) {
  const id = product?.id || product?.asin;
  if (!id) return null;

  const price =
    typeof product.price === "number" ? product.price : Number(product.price);
  const rating = clampRating(product.rating);
  const reviews = Number(product.reviewsCount || product.reviews || 0);
  const title = product.title || t("common.product");
  const category = product.category || t("common.topPick");

  return {
    id,
    name: title,
    price: Number.isFinite(price) ? price : 0,
    rating,
    reviews: Number.isFinite(reviews) ? reviews : 0,
    description: category,
    thumbnail: toHttps(getProductImage(product)),
    query: `${title} product`,
  };
}

function SellingCard({ item, liked, onToggle, t }) {
  const cacheKey = `selling-${String(item.id).toLowerCase()}`;
  const { image } = useUnsplashImage(item.query, cacheKey);
  const imgSrc = item.thumbnail || image?.url || "/fallback-product.png";
  const ratingText =
    item.reviews > 0 ? item.reviews : Number(item.rating || 0).toFixed(1);

  return (
    <article className={styles.card} role="listitem">
      <button
        type="button"
        className={`${styles.heartBtn} ${liked ? styles.hearted : ""}`}
        onClick={onToggle}
        aria-label={t("common.favorite")}
      >
        <Heart size={18} />
      </button>

      <Link to={`/p/${item.id}`} className={styles.cardLink}>
        <div className={styles.media}>
          <img
            src={imgSrc}
            alt={item.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/fallback-product.png";
            }}
          />
        </div>

        <div className={styles.body}>
          <div className={styles.row}>
            <h3 className={styles.name}>{item.name}</h3>
            <span className={styles.price}>${item.price.toFixed(2)}</span>
          </div>
          <p className={styles.desc}>{item.description}</p>
          <div className={styles.ratingRow}>
            <RatingStars value={item.rating} />
            <span className={styles.reviewText}>({ratingText})</span>
          </div>
          <button type="button" className={styles.addBtn}>
            {t("common.addToCart")}
          </button>
        </div>
      </Link>

      {image && (
        <p className={styles.credit}>
          {t("common.photoBy")} {" "}
          <a href={image.userLink} target="_blank" rel="noreferrer">
            {image.name}
          </a>{" "}
          {t("common.on")} {" "}
          <a href={image.unsplashLink} target="_blank" rel="noreferrer">
            {t("common.unsplash")}
          </a>
        </p>
      )}
    </article>
  );
}

export default function MostSelling() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(() => new Set());
  const { ref, inView } = useInView();

  useEffect(() => {
    let active = true;
    if (!inView) return () => {};

    async function load() {
      setLoading(true);
      try {
        const items = await getAllProducts();
        if (!active) return;
        setProducts(Array.isArray(items) ? items : []);
      } catch (e) {
        if (!active) return;
        setProducts([]);
      } finally {
        if (!active) return;
        setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [inView]);

  const items = useMemo(() => {
    const MAX_ITEMS = 12;
    const POOL_SIZE = 200;
    const weekKey = getWeekKey();

    const normalized = products
      .map((p) => normalizeProduct(p, t))
      .filter(Boolean)
      .map((p) => ({
        ...p,
        score: (p.reviews || 0) * (p.rating || 0),
      }));

    normalized.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.reviews !== a.reviews) return b.reviews - a.reviews;
      return b.rating - a.rating;
    });

    const pool = normalized.slice(0, POOL_SIZE);
    return pickWeeklyItems(pool, MAX_ITEMS, weekKey);
  }, [products, t]);

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
        <div className={styles.titleRow}>
          <span className={styles.titleMark} aria-hidden="true" />
          <h2 className={styles.title}>{t("home.mostSelling.title")}</h2>
        </div>
      </div>

      <div className={styles.scroller} role="list">
        {!loading &&
          items.map((item) => (
            <SellingCard
              key={item.id}
              item={item}
              liked={liked.has(item.id)}
              onToggle={() => toggleLike(item.id)}
              t={t}
            />
          ))}
      </div>
    </section>
  );
}
