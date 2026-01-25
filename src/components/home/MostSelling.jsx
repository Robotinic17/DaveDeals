import { useState } from "react";
import { Heart } from "lucide-react";
import styles from "./MostSelling.module.css";
import RatingStars from "../category/RatingStars";
import { useUnsplashImage } from "../../hooks/useUnsplashImage";

const items = [
  {
    id: "instax-mini-11",
    name: "Instax Mini 11",
    price: 89,
    rating: 4.7,
    reviews: 121,
    description: "Selfie mode and selfie mirror, Macro mode",
    query: "instant camera product",
  },
  {
    id: "hand-watch",
    name: "Hand Watch",
    price: 59,
    rating: 4.6,
    reviews: 121,
    description: "Citizen 650M, W-69g",
    query: "wrist watch product",
  },
  {
    id: "adidas-sneakers",
    name: "adidas Sneakers",
    price: 159,
    rating: 4.8,
    reviews: 121,
    description: "x Sean Wotherspoon Superstar sneakers",
    query: "colorful sneakers product",
  },
];

function SellingCard({ item, liked, onToggle }) {
  const { image } = useUnsplashImage(item.query, `selling-${item.id}`);

  return (
    <article className={styles.card} role="listitem">
      <button
        type="button"
        className={`${styles.heartBtn} ${liked ? styles.hearted : ""}`}
        onClick={onToggle}
        aria-label="Favorite"
      >
        <Heart size={18} />
      </button>

      <div className={styles.media}>
        {image?.url ? (
          <img
            src={image.url}
            alt={item.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className={styles.mediaFallback} />
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.row}>
          <h3 className={styles.name}>{item.name}</h3>
          <span className={styles.price}>${item.price.toFixed(2)}</span>
        </div>
        <p className={styles.desc}>{item.description}</p>
        <div className={styles.ratingRow}>
          <RatingStars value={item.rating} />
          <span className={styles.reviewText}>({item.reviews})</span>
        </div>
        {image && (
          <p className={styles.credit}>
            Photo by{" "}
            <a href={image.userLink} target="_blank" rel="noreferrer">
              {image.name}
            </a>{" "}
            on{" "}
            <a href={image.unsplashLink} target="_blank" rel="noreferrer">
              Unsplash
            </a>
          </p>
        )}
        <button type="button" className={styles.addBtn}>
          Add to Cart
        </button>
      </div>
    </article>
  );
}

export default function MostSelling() {
  const [liked, setLiked] = useState(() => new Set());

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
        <div className={styles.titleRow}>
          <span className={styles.titleMark} aria-hidden="true" />
          <h2 className={styles.title}>Most Selling Products</h2>
        </div>
      </div>

      <div className={styles.scroller} role="list">
        {items.map((item) => (
          <SellingCard
            key={item.id}
            item={item}
            liked={liked.has(item.id)}
            onToggle={() => toggleLike(item.id)}
          />
        ))}
      </div>
    </section>
  );
}
