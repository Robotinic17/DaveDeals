import styles from "./GiftCards.module.css";

export default function GiftCards() {
  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>Gift Cards</p>
          <h1 className={styles.title}>Give DaveDeals, instantly</h1>
          <p className={styles.subtitle}>
            Gift cards are coming soon. You will be able to send digital cards
            instantly or schedule them for special moments.
          </p>
        </div>
        <div className={styles.banner}>
          <h2>Coming soon</h2>
          <p>
            We are finalizing the gift card experience. Join the early access
            list to be notified when it launches.
          </p>
          <form className={styles.form}>
            <input type="email" placeholder="Email address" />
            <button type="button">Notify me</button>
          </form>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Personalized messages</h3>
          <p>Add a note and schedule delivery for birthdays or celebrations.</p>
        </div>
        <div className={styles.card}>
          <h3>Flexible amounts</h3>
          <p>Choose a value that fits every occasion, from small to premium.</p>
        </div>
        <div className={styles.card}>
          <h3>Instant delivery</h3>
          <p>Digital cards arrive instantly by email when you need them.</p>
        </div>
      </div>
    </section>
  );
}
