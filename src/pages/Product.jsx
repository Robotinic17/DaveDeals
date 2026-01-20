import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import styles from "./Product.module.css";

import RatingStars from "../components/category/RatingStars";
import { getProductById, getProductsByCategorySlug } from "../lib/catalog";

const COLOR_SWATCHES = [
  { id: "black", label: "Black", hex: "#121212" },
  { id: "white", label: "White", hex: "#f3f3f3" },
  { id: "gray", label: "Gray", hex: "#9a9a9a" },
  { id: "blue", label: "Blue", hex: "#2c5aa0" },
  { id: "red", label: "Red", hex: "#c73b3b" },
  { id: "green", label: "Green", hex: "#2c7b5a" },
  { id: "yellow", label: "Yellow", hex: "#d5b53d" },
  { id: "pink", label: "Pink", hex: "#d38aa7" },
  { id: "purple", label: "Purple", hex: "#7b5fb2" },
  { id: "orange", label: "Orange", hex: "#d9853b" },
];

function clampRating(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(5, n));
}

export default function Product() {
  const { id } = useParams();
  const { t } = useTranslation();

  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(false);
      try {
        const item = await getProductById(id);
        if (!active) return;
        if (!item) {
          setProduct(null);
          setSimilar([]);
          return;
        }

        setProduct(item);
        const categorySlug = item.categorySlug;
        if (categorySlug) {
          const related = await getProductsByCategorySlug(categorySlug);
          if (!active) return;
          const filtered = related
            .filter((p) => (p.id || p.asin) !== (item.id || item.asin))
            .slice(0, 6);
          setSimilar(filtered);
        } else {
          setSimilar([]);
        }
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
  }, [id]);

  const gallery = useMemo(() => {
    if (!product) return [];
    const src = (product.thumbnail || product.imgUrl || "").replace(
      /^http:\/\//,
      "https://"
    );
    if (!src) return [];
    return [src, src, src, src];
  }, [product]);

  useEffect(() => {
    if (gallery.length) setActiveImage(gallery[0]);
  }, [gallery]);

  const rating = clampRating(product?.rating);
  const price =
    typeof product?.price === "number" ? product.price : Number(product?.price);

  const suggestedColors = useMemo(() => {
    const text = String(product?.title || "").toLowerCase();
    const matches = COLOR_SWATCHES.filter((c) =>
      text.includes(c.id === "gray" ? "gray" : c.id)
    );
    return matches.length ? matches : COLOR_SWATCHES.slice(0, 5);
  }, [product]);

  if (loading) {
    return (
      <section className={styles.page}>
        <div className={styles.skeletonHero} />
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className={styles.page}>
        <div className={styles.emptyState}>
          <h1>Product unavailable</h1>
          <p>
            We couldn’t find this product. Try going back or browsing another
            category.
          </p>
          <Link to="/categories" className={styles.backBtn}>
            Browse categories
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            <img
              src={activeImage || "/fallback-product.png"}
              alt={product.title || "Product"}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/fallback-product.png";
              }}
            />
          </div>
          <div className={styles.thumbs}>
            {gallery.map((src, idx) => (
              <button
                key={`${src}-${idx}`}
                type="button"
                className={`${styles.thumbBtn} ${
                  src === activeImage ? styles.thumbActive : ""
                }`}
                onClick={() => setActiveImage(src)}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.details}>
          <p className={styles.category}>{product.category || "Featured"}</p>
          <h1 className={styles.title}>{product.title}</h1>
          <div className={styles.ratingRow}>
            <RatingStars value={rating} />
            <span className={styles.ratingText}>
              {rating.toFixed(1)} ({product.reviewsCount || 0})
            </span>
          </div>

          <div className={styles.priceBlock}>
            <span className={styles.price}>
              {Number.isFinite(price) ? `$${price}` : "$?"}
            </span>
            <span className={styles.priceNote}>Free delivery available</span>
          </div>

          <div className={styles.section}>
            <h3>Choose a color</h3>
            <div className={styles.swatches}>
              {suggestedColors.map((c, idx) => (
                <button
                  key={c.id}
                  type="button"
                  className={`${styles.swatch} ${
                    idx === 0 ? styles.swatchActive : ""
                  }`}
                  style={{ background: c.hex }}
                  aria-label={c.label}
                />
              ))}
            </div>
          </div>

          <div className={styles.ctaRow}>
            <button type="button" className={styles.buyBtn}>
              Buy now
            </button>
            <button type="button" className={styles.cartBtn}>
              Add to cart
            </button>
          </div>

          <div className={styles.infoCards}>
            <div className={styles.infoCard}>
              <h4>Free delivery</h4>
              <p>Check delivery availability in your area.</p>
            </div>
            <div className={styles.infoCard}>
              <h4>Easy returns</h4>
              <p>30‑day returns with pickup options.</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.specs}>
        <div className={styles.specCard}>
          <h3>General</h3>
          <div className={styles.specRow}>
            <span>Product ID</span>
            <span>{product.id || product.asin}</span>
          </div>
          <div className={styles.specRow}>
            <span>Category</span>
            <span>{product.category || "General"}</span>
          </div>
          <div className={styles.specRow}>
            <span>Rating</span>
            <span>{rating.toFixed(1)}</span>
          </div>
          <div className={styles.specRow}>
            <span>Reviews</span>
            <span>{product.reviewsCount || 0}</span>
          </div>
        </div>

        <div className={styles.specCard}>
          <h3>Details</h3>
          <div className={styles.specRow}>
            <span>Availability</span>
            <span>In stock</span>
          </div>
          <div className={styles.specRow}>
            <span>Shipping</span>
            <span>Standard (3-5 days)</span>
          </div>
          <div className={styles.specRow}>
            <span>Warranty</span>
            <span>1 year</span>
          </div>
          <div className={styles.specRow}>
            <span>Condition</span>
            <span>New</span>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div className={styles.similar}>
          <h3>Similar items you might like</h3>
          <div className={styles.similarGrid}>
            {similar.map((item, idx) => {
              const pid = item.id || item.asin;
              const imgSrc = (item.thumbnail || item.imgUrl || "").replace(
                /^http:\/\//,
                "https://"
              );
              return (
                <Link
                  key={pid}
                  to={`/p/${pid}`}
                  className={styles.similarCard}
                >
                  <img
                    src={imgSrc || "/fallback-product.png"}
                    alt={item.title || "Product"}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/fallback-product.png";
                    }}
                  />
                  <div>
                    <p className={styles.similarTitle}>{item.title}</p>
                    <p className={styles.similarMeta}>
                      {Number.isFinite(Number(item.price))
                        ? `$${Number(item.price)}`
                        : "$?"}
                    </p>
                  </div>
                  <motion.span
                    className={styles.similarBadge}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(idx * 0.05, 0.2) }}
                  >
                    View
                  </motion.span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
