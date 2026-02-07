import styles from "./AccountSignup.module.css";

export default function AccountSignup() {
  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>Account Signup</p>
          <h1 className={styles.title}>Create your DaveDeals account</h1>
          <p className={styles.subtitle}>
            Start shopping, save favorites, and track orders in one place. Seller
            accounts and admin tools are coming soon.
          </p>
        </div>
        <div className={styles.formCard}>
          <h2>Get started</h2>
          <form className={styles.form}>
            <label>
              Full name
              <input type="text" placeholder="Your name" />
            </label>
            <label>
              Email address
              <input type="email" placeholder="you@example.com" />
            </label>
            <label>
              Password
              <input type="password" placeholder="Create a password" />
            </label>
            <button type="button" className={styles.primaryBtn}>
              Create account
            </button>
            <p className={styles.note}>
              By creating an account, you agree to our Terms and Privacy Policy.
            </p>
          </form>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Saved items</h3>
          <p>Keep track of your favorite products and deals.</p>
        </div>
        <div className={styles.card}>
          <h3>Order tracking</h3>
          <p>View shipment status and updates in real time.</p>
        </div>
        <div className={styles.card}>
          <h3>Seller tools coming soon</h3>
          <p>We are building admin features for sellers and partners.</p>
        </div>
      </div>
    </section>
  );
}
