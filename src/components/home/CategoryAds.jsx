import { useTranslation } from "react-i18next";
import styles from "./CategoryAds.module.css";
import { useUnsplashImage } from "../../hooks/useUnsplashImage";

const deals = [
  {
    id: "living-room",
    price: 100,
    accent: "#c69018",
    bg: "#f4e6db",
    query: "living room furniture set",
  },
  {
    id: "home-decor",
    price: 29,
    accent: "#a12826",
    bg: "#f8dddd",
    query: "home decor accessories",
  },
  {
    id: "fashion-apparel",
    price: 67,
    accent: "#8b5a3c",
    bg: "#f1e1d6",
    query: "fashion apparel rack",
  },
  {
    id: "school-backpack",
    price: 59,
    accent: "#0c5542",
    bg: "#d8f7ed",
    query: "backpack product flat lay",
  },
];

function DealCard({ deal, t }) {
  const CACHE_VERSION = "v3";
  const { image } = useUnsplashImage(
    deal.query,
    `category-ad-${deal.id}-${CACHE_VERSION}`,
  );

  return (
    <article className={styles.card} style={{ backgroundColor: deal.bg }}>
      <div className={styles.content}>
        <p className={styles.kicker}>{t("home.categoryAds.kicker")}</p>
        <p className={styles.price} style={{ color: deal.accent }}>
          ${deal.price}
        </p>
        <p className={styles.copy}>{t("home.categoryAds.copy")}</p>
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
      <div className={styles.media}>
        {image?.url ? (
          <img
            src={image.url}
            alt={t("home.categoryAds.imageAlt", { amount: `$${deal.price}` })}
          />
        ) : (
          <div className={styles.mediaFallback} />
        )}
      </div>
    </article>
  );
}

export default function CategoryAds() {
  const { t } = useTranslation();

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>{t("home.categoryAds.title")}</h2>

        <div className={styles.grid}>
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
