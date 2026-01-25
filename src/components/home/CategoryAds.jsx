import styles from "./CategoryAds.module.css";
import deal100 from "../../assets/100.png";
import deal29 from "../../assets/29.png";
import deal67 from "../../assets/67.png";
import deal59 from "../../assets/59.png";

const deals = [
  {
    price: 100,
    accent: "#c69018",
    bg: "#f4e6db",
    img: deal100,
  },
  {
    price: 29,
    accent: "#a12826",
    bg: "#f8dddd",
    img: deal29,
  },
  {
    price: 67,
    accent: "#8b5a3c",
    bg: "#f1e1d6",
    img: deal67,
  },
  {
    price: 59,
    accent: "#0c5542",
    bg: "#d8f7ed",
    img: deal59,
  },
];

export default function CategoryAds() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Get Up To 70% Off</h2>

        <div className={styles.grid}>
          {deals.map((deal) => (
            <article
              key={deal.price}
              className={styles.card}
              style={{ backgroundColor: deal.bg }}
            >
              <div className={styles.content}>
                <p className={styles.kicker}>Save</p>
                <p className={styles.price} style={{ color: deal.accent }}>
                  ${deal.price}
                </p>
                <p className={styles.copy}>
                  Explore Our Furniture & Home Furnishing Range
                </p>
              </div>
              <div className={styles.media}>
                <img src={deal.img} alt={`Save $${deal.price}`} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
