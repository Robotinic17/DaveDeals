import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Heart, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./ProductCard.module.css";
import RatingStars from "../category/RatingStars";
import { formatNaira } from "../../lib/currency";

/**
 * ProductCard — Design System v1.0
 * Renders a product card with:
 * - Image (1:1 aspect ratio, scales on hover)
 * - Category label (uppercase, brand-700)
 * - Product name (2-line clamp)
 * - Star rating + review count
 * - Price (Fraunces, bold)
 * - Add to cart button (32x36px, rounded square)
 */
export default function ProductCard({
  id,
  title,
  category,
  price,
  image,
  rating = 0,
  reviewCount = 0,
  liked = false,
  onLikeToggle,
  onAddToCart,
  isInCart = false,
}) {
  const { t } = useTranslation();

  const displayPrice = formatNaira(price, t("common.priceNA"));

  return (
    <motion.article
      className={styles.card}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Wishlist button */}
      <motion.button
        type="button"
        className={`${styles.heartBtn} ${liked ? styles.hearted : ""}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onLikeToggle?.();
        }}
        aria-label={t("common.favorite")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Heart size={18} />
      </motion.button>

      {/* Link wrapper */}
      <Link to={`/product/${id}`} className={styles.linkWrap}>
        {/* Image wrapper */}
        <div className={styles.imageWrap}>
          {image ? (
            <img
              src={image}
              alt={title}
              className={styles.image}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/fallback-product.png";
              }}
            />
          ) : (
            <div className={styles.imagePlaceholder}>📦</div>
          )}
        </div>

        {/* Card body */}
        <div className={styles.body}>
          {/* Category label */}
          <div className={styles.category}>{category || "Product"}</div>

          {/* Product name */}
          <h3 className={styles.name}>{title}</h3>

          {/* Rating row with stars & count */}
          <div className={styles.ratingRow}>
            <span className={styles.ratingStars}>
              <RatingStars value={rating} />
            </span>
            <span className={styles.ratingCount}>({reviewCount})</span>
          </div>

          {/* Price & add button row */}
          <div className={styles.priceRow}>
            <span className={styles.price}>{displayPrice}</span>
            <motion.button
              type="button"
              className={`${styles.addBtn} ${isInCart ? styles.addBtnActive : ""}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart?.();
              }}
              aria-label={t("common.addToCart")}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              {isInCart ? (
                <Check aria-hidden="true" />
              ) : (
                <Plus aria-hidden="true" />
              )}
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
