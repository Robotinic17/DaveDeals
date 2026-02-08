import styles from "./MobileApp.module.css";
import phonesImg from "../assets/stage.png";

export default function MobileApp() {
  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>Mobile App</p>
          <h1 className={styles.title}>Shop and track on the go</h1>
          <p className={styles.subtitle}>
            The DaveDeals mobile app is coming soon with faster discovery, saved
            deals, and real-time delivery updates.
          </p>
          <div className={styles.ctaRow}>
            <button type="button" className={styles.primaryBtn}>
              Join the waitlist
            </button>
            <button type="button" className={styles.secondaryBtn}>
              Notify me
            </button>
          </div>
        </div>
        <div className={styles.heroCard}>
          <img src={phonesImg} alt="DaveDeals mobile app preview" decoding="async" />
          <div className={styles.badge}>Coming soon</div>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Personalized alerts</h3>
          <p>Get notified when prices drop or new deals match your favorites.</p>
        </div>
        <div className={styles.card}>
          <h3>Saved shopping lists</h3>
          <p>Track items you want and access them anytime across devices.</p>
        </div>
        <div className={styles.card}>
          <h3>Real-time delivery</h3>
          <p>Follow your order with live tracking and timeline updates.</p>
        </div>
      </div>
    </section>
  );
}

