import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import styles from "./Brands.module.css";
import staplesLogo from "../assets/staples.png";
import sproutsLogo from "../assets/sprouts.png";
import groceryOutletLogo from "../assets/grocery-outlet.png";
import mollieStonesLogo from "../assets/mollie-stones.png";
import sportsBasementLogo from "../assets/sports-basement.png";
import containerStoreLogo from "../assets/container-store.png";
import targetLogo from "../assets/target.png";
import bevmoLogo from "../assets/bevmo.png";
import amazonLogo from "../assets/Amazon.png";
import walmartLogo from "../assets/walmart.png";
import costcoLogo from "../assets/Costco-logo.png";
import bestBuyLogo from "../assets/bestbuy.png";
import wholeFoodsLogo from "../assets/whole-foods.svg";

const brands = [
  {
    name: "Staples",
    delivery: "Delivery within 24 hours",
    category: "Office",
    logo: staplesLogo,
  },
  {
    name: "Sprouts",
    delivery: "Delivery within 24 hours",
    category: "Grocery",
    logo: sproutsLogo,
  },
  {
    name: "Grocery Outlet",
    delivery: "Delivery within 24 hours",
    category: "Grocery",
    logo: groceryOutletLogo,
  },
  {
    name: "Mollie Stones",
    delivery: "Delivery within 24 hours",
    category: "Grocery",
    logo: mollieStonesLogo,
  },
  {
    name: "Sports Basement",
    delivery: "Delivery within 24 hours",
    category: "Sports",
    logo: sportsBasementLogo,
  },
  {
    name: "Container Store",
    delivery: "Delivery within 24 hours",
    category: "Home",
    logo: containerStoreLogo,
  },
  {
    name: "Target",
    delivery: "Delivery within 24 hours",
    category: "Retail",
    logo: targetLogo,
  },
  {
    name: "BevMo!",
    delivery: "Delivery within 24 hours",
    category: "Beverages",
    logo: bevmoLogo,
  },
  {
    name: "Amazon",
    delivery: "Delivery within 24 hours",
    category: "Retail",
    logo: amazonLogo,
  },
  {
    name: "Walmart",
    delivery: "Delivery within 24 hours",
    category: "Retail",
    logo: walmartLogo,
  },
  {
    name: "Costco",
    delivery: "Delivery within 24 hours",
    category: "Wholesale",
    logo: costcoLogo,
  },
  {
    name: "Best Buy",
    delivery: "Delivery within 24 hours",
    category: "Electronics",
    logo: bestBuyLogo,
  },
  {
    name: "Whole Foods",
    delivery: "Delivery within 24 hours",
    category: "Grocery",
    logo: wholeFoodsLogo,
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

function BrandCard({ brand }) {
  return (
    <article className={styles.card} role="listitem">
      <div className={styles.logoWrap}>
        <span className={styles.logoFallback} aria-hidden="true">
          {getInitials(brand.name)}
        </span>
        {brand.logo ? (
          <img
            src={brand.logo}
            alt={`${brand.name} logo`}
            loading="lazy"
            onLoad={(e) => {
              e.currentTarget.parentElement?.classList.add(styles.logoLoaded);
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}
      </div>
      <div className={styles.info}>
        <h3>{brand.name}</h3>
        <p>{brand.category}</p>
        <span className={styles.meta}>{brand.delivery}</span>
      </div>
      <button type="button" className={styles.secondaryBtn}>
        View brand
      </button>
    </article>
  );
}

export default function Brands() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();

  const filteredBrands = useMemo(() => {
    if (!normalized) return brands;
    return brands.filter((brand) =>
      `${brand.name} ${brand.category}`.toLowerCase().includes(normalized)
    );
  }, [normalized]);

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>DaveDeals Brands</p>
          <h1 className={styles.title}>Shop by brand</h1>
          <p className={styles.subtitle}>
            Browse trusted brands on DaveDeals. Select a brand to discover
            curated products and standout value.
          </p>
          <div className={styles.searchRow}>
            <div className={styles.searchInput}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Search brands"
                aria-label="Search brands"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <button
              type="button"
              className={styles.searchBtn}
              onClick={() => setQuery(query.trim())}
            >
              Search
            </button>
          </div>
        </div>
        <div className={styles.heroCard}>
          <h3>Brand highlight</h3>
          <p>
            We partner with retailers that deliver fast, reliable service. New
            brands are added weekly.
          </p>
          <div className={styles.heroStats}>
            <div>
              <span className={styles.statLabel}>Active brands</span>
              <span className={styles.statValue}>{brands.length}</span>
            </div>
            <div>
              <span className={styles.statLabel}>Avg delivery</span>
              <span className={styles.statValue}>24 hrs</span>
            </div>
          </div>
          <button type="button" className={styles.primaryBtn}>
            Become a partner
          </button>
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <h2>All brands</h2>
        <p>Tap a brand to explore its latest offers.</p>
      </div>

      <div className={styles.grid} role="list">
        {filteredBrands.map((brand) => (
          <BrandCard key={brand.name} brand={brand} />
        ))}
        {filteredBrands.length === 0 && (
          <div className={styles.emptyState}>
            No brands match that search. Try a different keyword.
          </div>
        )}
      </div>
    </section>
  );
}
