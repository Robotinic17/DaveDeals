import styles from "./TopBrands.module.css";
import staplesLogo from "../../assets/staples.png";
import sproutsLogo from "../../assets/sprouts.png";
import groceryOutletLogo from "../../assets/grocery-outlet.png";
import mollieStonesLogo from "../../assets/mollie-stones.png";
import sportsBasementLogo from "../../assets/sports-basement.png";
import containerStoreLogo from "../../assets/container-store.png";
import targetLogo from "../../assets/target.png";
import bevmoLogo from "../../assets/bevmo.png";

const brands = [
  {
    name: "Staples",
    delivery: "Delivery within 24 hours",
    logo: staplesLogo,
  },
  {
    name: "Sprouts",
    delivery: "Delivery within 24 hours",
    logo: sproutsLogo,
    featured: true,
  },
  {
    name: "Grocery outlet",
    delivery: "Delivery within 24 hours",
    logo: groceryOutletLogo,
  },
  {
    name: "Mollie stones",
    delivery: "Delivery within 24 hours",
    logo: mollieStonesLogo,
  },
  {
    name: "Sports Basement",
    delivery: "Delivery within 24 hours",
    logo: sportsBasementLogo,
  },
  {
    name: "Container Store",
    delivery: "Delivery within 24 hours",
    logo: containerStoreLogo,
  },
  {
    name: "Target",
    delivery: "Delivery within 24 hours",
    logo: targetLogo,
  },
  {
    name: "BevMo!",
    delivery: "Delivery within 24 hours",
    logo: bevmoLogo,
  },
];

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TopBrands() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>Choose By Brand</h2>
        </div>

        <div className={styles.grid} role="list">
          {brands.map((brand) => (
            <article
              key={brand.name}
              className={`${styles.card} ${
                brand.featured ? styles.featured : ""
              }`}
              role="listitem"
            >
              <div className={styles.logoWrap}>
                <span className={styles.logoFallback} aria-hidden="true">
                  {getInitials(brand.name)}
                </span>
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  loading="lazy"
                  onLoad={(e) => {
                    e.currentTarget.parentElement?.classList.add(
                      styles.logoLoaded
                    );
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className={styles.info}>
                <h3 className={styles.brand}>{brand.name}</h3>
                <p className={styles.meta}>{brand.delivery}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
