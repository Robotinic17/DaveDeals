import { Link } from "react-router-dom";
import styles from "./ServicesHelp.module.css";
import { useUnsplashImage } from "../../hooks/useUnsplashImage";

const services = [
  {
    id: "faq",
    title: "Frequently Asked Questions",
    copy: "Updates on safe Shopping in our Stores",
    query: "mother daughter shopping online",
    to: "/categories",
  },
  {
    id: "payment",
    title: "Online Payment Process",
    copy: "Updates on safe Shopping in our Stores",
    query: "mobile payment phone hand",
    to: "/checkout",
  },
  {
    id: "delivery",
    title: "Home Delivery Options",
    copy: "Updates on safe Shopping in our Stores",
    query: "delivery courier green uniform",
    to: "/deals/delivery",
  },
];

function ServiceCard({ service }) {
  const cacheKey = `service-${service.id}-v1`;
  const { image } = useUnsplashImage(service.query, cacheKey);

  return (
    <article className={styles.card}>
      <Link to={service.to} className={styles.cardLink}>
        <div className={styles.body}>
          <h3 className={styles.cardTitle}>{service.title}</h3>
          <p className={styles.copy}>{service.copy}</p>
        </div>

        <div className={styles.media} style={{ backgroundColor: service.bg }}>
          {image?.url ? (
            <img src={image.url} alt={service.title} loading="lazy" />
          ) : (
            <div className={styles.mediaFallback} />
          )}
        </div>
      </Link>

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
    </article>
  );
}

export default function ServicesHelp() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Services To Help You Shop</h2>

        <div className={styles.grid}>
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
