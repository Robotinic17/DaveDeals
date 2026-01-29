import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./ServicesHelp.module.css";
import { useUnsplashImage } from "../../hooks/useUnsplashImage";

const services = [
  {
    id: "faq",
    query: "mother daughter shopping online",
    to: "/categories",
  },
  {
    id: "payment",
    query: "mobile payment phone hand",
    to: "/checkout",
  },
  {
    id: "delivery",
    query: "delivery courier green uniform",
    to: "/deals/delivery",
  },
];

function ServiceCard({ service, t }) {
  const cacheKey = `service-${service.id}-v1`;
  const { image } = useUnsplashImage(service.query, cacheKey);

  return (
    <article className={styles.card}>
      <Link to={service.to} className={styles.cardLink}>
        <div className={styles.body}>
          <h3 className={styles.cardTitle}>
            {t(`home.servicesHelp.cards.${service.id}.title`)}
          </h3>
          <p className={styles.copy}>
            {t(`home.servicesHelp.cards.${service.id}.copy`)}
          </p>
        </div>

        <div className={styles.media}>
          {image?.url ? (
            <img
              src={image.url}
              alt={t(`home.servicesHelp.cards.${service.id}.title`)}
              loading="lazy"
            />
          ) : (
            <div className={styles.mediaFallback} />
          )}
        </div>
      </Link>

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
    </article>
  );
}

export default function ServicesHelp() {
  const { t } = useTranslation();

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>{t("home.servicesHelp.title")}</h2>

        <div className={styles.grid}>
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
