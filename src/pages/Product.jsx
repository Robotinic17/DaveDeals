import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import styles from "./Product.module.css";

import RatingStars from "../components/category/RatingStars";
import { getProductById, getProductsByCategorySlug } from "../lib/catalog";
import { getProductImage } from "../lib/productImages";

const COLOR_SWATCHES = [
  { id: "black", hex: "#121212" },
  { id: "white", hex: "#f3f3f3" },
  { id: "gray", hex: "#9a9a9a" },
  { id: "blue", hex: "#2c5aa0" },
  { id: "red", hex: "#c73b3b" },
  { id: "green", hex: "#2c7b5a" },
  { id: "yellow", hex: "#d5b53d" },
  { id: "pink", hex: "#d38aa7" },
  { id: "purple", hex: "#7b5fb2" },
  { id: "orange", hex: "#d9853b" },
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
    const images = Array.isArray(product.images) ? product.images : [];
    const normalized = images
      .map((url) => String(url || "").replace(/^http:\/\//, "https://").trim())
      .filter(Boolean);

    if (normalized.length) return normalized.slice(0, 6);

    const src = (product.thumbnail || product.imgUrl || "").replace(
      /^http:\/\//,
      "https://"
    );
    if (!src) return ["/fallback-product.png"];
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
          <h1>{t("product.unavailable.title")}</h1>
          <p>{t("product.unavailable.body")}</p>
          <Link to="/categories" className={styles.backBtn}>
            {t("product.unavailable.cta")}
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
              alt={product.title || t("common.product")}
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
                <img
                  src={src || "/fallback-product.png"}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/fallback-product.png";
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.details}>
          <p className={styles.category}>{product.category || t("product.featured")}</p>
          <h1 className={styles.title}>{product.title}</h1>
          <div className={styles.ratingRow}>
            <RatingStars value={rating} />
            <span className={styles.ratingText}>
              {rating.toFixed(1)} ({product.reviewsCount || 0})
            </span>
          </div>

          <div className={styles.priceBlock}>
            <span className={styles.price}>
              {Number.isFinite(price) ? `$${price}` : t("common.priceNA")}
            </span>
            <span className={styles.priceNote}>{t("product.priceNote")}</span>
          </div>

          <div className={styles.section}>
            <h3>{t("product.chooseColor")}</h3>
            <div className={styles.swatches}>
              {suggestedColors.map((c, idx) => (
                <button
                  key={c.id}
                  type="button"
                  className={`${styles.swatch} ${
                    idx === 0 ? styles.swatchActive : ""
                  }`}
                  style={{ background: c.hex }}
                  aria-label={t(`category.colors.${c.id}`)}
                />
              ))}
            </div>
          </div>

          <div className={styles.ctaRow}>
            <button type="button" className={styles.buyBtn}>
              {t("product.buyNow")}
            </button>
            <button type="button" className={styles.cartBtn}>
              {t("common.addToCart")}
            </button>
          </div>

          <div className={styles.infoCards}>
            <div className={styles.infoCard}>
              <h4>{t("product.info.freeDeliveryTitle")}</h4>
              <p>{t("product.info.freeDeliveryBody")}</p>
            </div>
            <div className={styles.infoCard}>
              <h4>{t("product.info.easyReturnsTitle")}</h4>
              <p>{t("product.info.easyReturnsBody")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.specs}>
        <div className={styles.specCard}>
          <h3>{t("product.specs.general")}</h3>
          <div className={styles.specRow}>
            <span>{t("product.specs.productId")}</span>
            <span>{product.id || product.asin}</span>
          </div>
          <div className={styles.specRow}>
            <span>{t("product.specs.category")}</span>
            <span>{product.category || t("product.specs.generalValue")}</span>
          </div>
          <div className={styles.specRow}>
            <span>{t("product.specs.rating")}</span>
            <span>{rating.toFixed(1)}</span>
          </div>
          <div className={styles.specRow}>
            <span>{t("product.specs.reviews")}</span>
            <span>{product.reviewsCount || 0}</span>
          </div>
        </div>

        <div className={styles.specCard}>
          <h3>{t("product.specs.details")}</h3>
          <div className={styles.specRow}>
            <span>{t("product.specs.availability")}</span>
            <span>{t("product.specs.inStock")}</span>
          </div>
          <div className={styles.specRow}>
            <span>{t("product.specs.shipping")}</span>
            <span>{t("product.specs.shippingValue")}</span>
          </div>
          <div className={styles.specRow}>
            <span>{t("product.specs.warranty")}</span>
            <span>{t("product.specs.warrantyValue")}</span>
          </div>
          <div className={styles.specRow}>
            <span>{t("product.specs.condition")}</span>
            <span>{t("product.specs.conditionValue")}</span>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div className={styles.similar}>
          <h3>{t("product.similar.title")}</h3>
          <div className={styles.similarGrid}>
            {similar.map((item, idx) => {
              const pid = item.id || item.asin;
              const imgSrc = getProductImage(item);
              return (
                <Link
                  key={pid}
                  to={`/p/${pid}`}
                  className={styles.similarCard}
                >
                  <img
                    src={imgSrc || "/fallback-product.png"}
                    alt={item.title || t("common.product")}
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
                        : t("common.priceNA")}
                    </p>
                  </div>
                  <motion.span
                    className={styles.similarBadge}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(idx * 0.05, 0.2) }}
                  >
                    {t("common.view")}
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



