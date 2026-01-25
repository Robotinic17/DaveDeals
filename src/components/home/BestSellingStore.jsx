import { Tag } from "lucide-react";
import styles from "./BestSellingStore.module.css";
import staplesLogo from "../../assets/staples.png";
import bevmoLogo from "../../assets/bevmo.png";
import targetLogo from "../../assets/target.png";
import shopLogo from "../../assets/logo.png";
import { useUnsplashImage } from "../../hooks/useUnsplashImage";

const stores = [
  {
    name: "Staples",
    category: "Bag • Perfume",
    delivery: "Delivery with in 24 hours",
    logo: staplesLogo,
    query: "stationery desk accessories flat lay",
  },
  {
    name: "Now Delivery",
    category: "Bag • Perfume",
    delivery: "Delivery with in 24 hours",
    logo: targetLogo,
    query: "smartphone accessories product",
  },
  {
    name: "Bevmo",
    category: "Bag • Perfume",
    delivery: "Delivery with in 24 hours",
    logo: bevmoLogo,
    query: "beauty skincare bottles product",
  },
  {
    name: "Quicklly",
    category: "Bag • Perfume",
    delivery: "Delivery with in 24 hours",
    logo: shopLogo,
    query: "sneakers product shot",
  },
];

function StoreCard({ store }) {
  const { image } = useUnsplashImage(
    store.query,
    `store-${store.name.toLowerCase().replace(/\s+/g, "-")}`
  );

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {image?.url ? (
          <img src={image.url} alt={store.name} loading="lazy" />
        ) : (
          <div className={styles.mediaFallback} />
        )}
        <span className={styles.logoWrap}>
          <img src={store.logo} alt={`${store.name} logo`} />
        </span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.cardTitle}>{store.name}</h3>
        <p className={styles.meta}>{store.category}</p>
        <p className={styles.delivery}>
          <Tag size={16} />
          {store.delivery}
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
    </article>
  );
}

export default function BestSellingStore() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Best Selling Store</h2>

        <div className={styles.grid}>
          {stores.map((store) => (
            <StoreCard key={store.name} store={store} />
          ))}
        </div>
      </div>
    </section>
  );
}
