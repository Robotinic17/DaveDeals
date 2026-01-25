import styles from "./CategoryAds.module.css";
import { useUnsplashImage } from "../../hooks/useUnsplashImage";

const deals = [
  {
    price: 100,
    accent: "#c69018",
    bg: "#f4e6db",
    query: "living room furniture set",
  },
  {
    price: 29,
    accent: "#a12826",
    bg: "#f8dddd",
    query: "home decor accessories",
  },
  {
    price: 67,
    accent: "#8b5a3c",
    bg: "#f1e1d6",
    query: "fashion apparel rack",
  },
  {
    price: 59,
    accent: "#0c5542",
    bg: "#d8f7ed",
    query: "school backpack flat lay",
  },
];

function DealCard({ deal }) {
  const { image } = useUnsplashImage(
    deal.query,
    `category-ad-${deal.price}`
  );

  return (
    <article className={styles.card} style={{ backgroundColor: deal.bg }}>
      <div className={styles.content}>
        <p className={styles.kicker}>Save</p>
        <p className={styles.price} style={{ color: deal.accent }}>
          ${deal.price}
        </p>
        <p className={styles.copy}>
          Explore Our Furniture & Home Furnishing Range
        </p>
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
      </div>
      <div className={styles.media}>
        {image?.url ? (
          <img src={image.url} alt={`Save $${deal.price}`} />
        ) : (
          <div className={styles.mediaFallback} />
        )}
      </div>
    </article>
  );
}

export default function CategoryAds() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Get Up To 70% Off</h2>

        <div className={styles.grid}>
          {deals.map((deal) => (
            <DealCard key={deal.price} deal={deal} />
          ))}
        </div>
      </div>
    </section>
  );
}
