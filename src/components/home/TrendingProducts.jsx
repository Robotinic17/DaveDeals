import styles from "./TrendingProducts.module.css";
import { useUnsplashImage } from "../../hooks/useUnsplashImage";

const cards = [
  {
    title: "Furniture Village",
    meta: "Delivery with in 24 hours",
    query: "modern living room furniture",
  },
  {
    title: "Fashion World",
    meta: "Delivery with in 24 hours",
    query: "fashion clothing rack",
  },
];

function TrendingCard({ card }) {
  const { image } = useUnsplashImage(
    card.query,
    `trending-${card.title.toLowerCase().replace(/\s+/g, "-")}`
  );

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {image?.url ? (
          <img src={image.url} alt={card.title} loading="lazy" />
        ) : (
          <div className={styles.mediaFallback} />
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.cardTitle}>{card.title}</h3>
        <p className={styles.meta}>{card.meta}</p>
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
        <button type="button" className={styles.cta}>
          Shop Now
        </button>
      </div>
    </article>
  );
}

export default function TrendingProducts() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Trending Products For You!</h2>

        <div className={styles.grid}>
          {cards.map((card) => (
            <TrendingCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
