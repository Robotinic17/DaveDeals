import { useTranslation } from "react-i18next";
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
    logo: staplesLogo,
  },
  {
    name: "Sprouts",
    logo: sproutsLogo,
    featured: true,
  },
  {
    name: "Grocery outlet",
    logo: groceryOutletLogo,
  },
  {
    name: "Mollie stones",
    logo: mollieStonesLogo,
  },
  {
    name: "Sports Basement",
    logo: sportsBasementLogo,
  },
  {
    name: "Container Store",
    logo: containerStoreLogo,
  },
  {
    name: "Target",
    logo: targetLogo,
  },
  {
    name: "BevMo!",
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
  const { t } = useTranslation();

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t("home.topBrands.title")}</h2>
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
                  alt={t("home.topBrands.logoAlt", { brand: brand.name })}
                  loading="lazy"
                  onLoad={(e) => {
                    e.currentTarget.parentElement?.classList.add(
                      styles.logoLoaded,
                    );
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className={styles.info}>
                <h3 className={styles.brand}>{brand.name}</h3>
                <p className={styles.meta}>{t("home.topBrands.delivery")}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
