import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./RatingStars.module.css";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function RatingStars({ value }) {
  const { t } = useTranslation();
  const rating = clamp(Number(value) || 0, 0, 5);

  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <div
      className={styles.wrap}
      aria-label={t("category.ratingLabel", {
        rating: rating.toFixed(1),
      })}
    >
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f-${i}`} size={14} className={styles.full} />
      ))}

      {hasHalf && (
        <span className={styles.halfWrap} aria-hidden="true">
          <Star size={14} className={styles.empty} />
          <Star size={14} className={styles.half} />
        </span>
      )}

      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e-${i}`} size={14} className={styles.empty} />
      ))}
    </div>
  );
}
