import { Tag } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./BestSellingStore.module.css";
import staplesLogo from "../../assets/staples.png";
import bevmoLogo from "../../assets/bevmo.png";
import targetLogo from "../../assets/target.png";
import shopLogo from "../../assets/logo.png";
import { useUnsplashImage } from "../../hooks/useUnsplashImage";

const stores = [
  {
    name: "Staples",
    logo: staplesLogo,
    query: "stationery desk accessories flat lay",
  },
  {
    name: "Now Delivery",
    logo: targetLogo,
    query: "smartphone accessories product",
  },
  {
    name: "Bevmo",
    logo: bevmoLogo,
    query: "beauty skincare bottles product",
  },
  {
    name: "Quicklly",
    logo: shopLogo,
    query: "sneakers product shot",
  },
];

function StoreCard({ store, t }) {
  const { image } = useUnsplashImage(
    store.query,
    `store-${store.name.toLowerCase().replace(/\s+/g, "-")}`,
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
          <img
            src={store.logo}
            alt={t("home.bestSellingStore.logoAlt", { brand: store.name })}
          />
        </span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.cardTitle}>{store.name}</h3>
        <p className={styles.meta}>{t("home.bestSellingStore.category")}</p>
        <p className={styles.delivery}>
          <Tag size={16} />
          {t("home.bestSellingStore.delivery")}
        </p>
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
      </div>
    </article>
  );
}

export default function BestSellingStore() {
  const { t } = useTranslation();

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>{t("home.bestSellingStore.title")}</h2>

        <div className={styles.grid}>
          {stores.map((store) => (
            <StoreCard key={store.name} store={store} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
