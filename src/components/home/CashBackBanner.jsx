import styles from "./CashBackBanner.module.css";
import cardsImg from "../../assets/cards.png";

export default function CashBackBanner() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <h2 className={styles.title}>Get 5% Cash Back</h2>
          <p className={styles.sub}>on Shopcart.com</p>
          <button type="button" className={styles.cta}>
            Learn More
          </button>
        </div>
        <div className={styles.media}>
          <img src={cardsImg} alt="Shopcart cards" loading="lazy" />
        </div>
      </div>
    </section>
  );
}
