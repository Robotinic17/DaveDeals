import { useMemo, useState } from "react";
import { MapPin, Store, Package, Globe } from "lucide-react";
import styles from "./Locations.module.css";
import coverImg from "../assets/cover.jpg";
import bagsImg from "../assets/bags.png";
import gadgetsImg from "../assets/gadgets.png";
import snackImg from "../assets/snack.png";

const regions = [
  "Nigeria",
  "United States",
  "United Kingdom",
  "China",
  "Germany",
  "Canada",
];

const listings = [
  {
    id: "cn-tech",
    title: "Smart gadgets bundle",
    seller: "Shenzhen Tech Hub",
    region: "China",
    image: gadgetsImg,
    category: "Electronics",
  },
  {
    id: "ng-bags",
    title: "Premium leather tote",
    seller: "Lagos Craft Studio",
    region: "Nigeria",
    image: bagsImg,
    category: "Fashion",
  },
  {
    id: "ng-textiles",
    title: "Handwoven Ankara set",
    seller: "Ibadan Textile House",
    region: "Nigeria",
    image: coverImg,
    category: "Textiles",
  },
  {
    id: "ng-beauty",
    title: "Organic shea essentials",
    seller: "Abuja Naturals",
    region: "Nigeria",
    image: coverImg,
    category: "Beauty",
  },
  {
    id: "us-snack",
    title: "Healthy snack box",
    seller: "Austin Market Co.",
    region: "United States",
    image: snackImg,
    category: "Food",
  },
  {
    id: "uk-home",
    title: "Minimalist home set",
    seller: "London Living",
    region: "United Kingdom",
    image: coverImg,
    category: "Home",
  },
  {
    id: "de-accessories",
    title: "Everyday travel kit",
    seller: "Berlin Essentials",
    region: "Germany",
    image: coverImg,
    category: "Travel",
  },
  {
    id: "ca-stationery",
    title: "Creator stationery pack",
    seller: "Toronto Paperworks",
    region: "Canada",
    image: coverImg,
    category: "Office",
  },
];

export default function Locations() {
  const [selectedRegion, setSelectedRegion] = useState("Nigeria");

  const regionalListings = useMemo(
    () => listings.filter((item) => item.region === selectedRegion),
    [selectedRegion]
  );

  const otherListings = useMemo(
    () => listings.filter((item) => item.region !== selectedRegion),
    [selectedRegion]
  );

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>Shop by Location</p>
          <h1 className={styles.title}>Find products by region</h1>
          <p className={styles.subtitle}>
            Sellers upload products from their location. Choose a region to see
            what is available there, or explore other regions if your area does
            not have listings yet.
          </p>
        </div>
        <div className={styles.heroCard}>
          <div className={styles.heroCardHeader}>
            <Globe size={18} />
            <span>Choose your region</span>
          </div>
          <div className={styles.regionGrid}>
            {regions.map((region) => (
              <button
                key={region}
                type="button"
                className={`${styles.regionBtn} ${
                  selectedRegion === region ? styles.regionActive : ""
                }`}
                onClick={() => setSelectedRegion(region)}
              >
                <MapPin size={14} />
                {region}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <h2>Listings in {selectedRegion}</h2>
        <p>Products uploaded by sellers in this region.</p>
      </div>

      {regionalListings.length > 0 ? (
        <div className={styles.listingsGrid}>
          {regionalListings.map((item) => (
            <article key={item.id} className={styles.card}>
              <img src={item.image} alt={item.title} />
              <div className={styles.cardBody}>
                <span className={styles.category}>{item.category}</span>
                <h3>{item.title}</h3>
                <p>
                  <Store size={14} /> {item.seller}
                </p>
                <button type="button" className={styles.primaryBtn}>
                  View item
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h3>No listings in {selectedRegion} yet.</h3>
          <p>
            Sellers in this region have not uploaded products yet. You can shop
            from other regions below.
          </p>
        </div>
      )}

      <div className={styles.sectionHeader}>
        <h2>Explore other regions</h2>
        <p>Shop from sellers in other locations while we expand coverage.</p>
      </div>

      <div className={styles.listingsGrid}>
        {otherListings.map((item) => (
          <article key={item.id} className={styles.cardAlt}>
            <div className={styles.cardAltHeader}>
              <Package size={16} />
              <span>{item.region}</span>
            </div>
            <div className={styles.cardAltBody}>
              <h3>{item.title}</h3>
              <p>{item.category}</p>
              <span className={styles.seller}>{item.seller}</span>
              <button type="button" className={styles.secondaryBtn}>
                Browse region
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
