import { Link, useNavigate } from "react-router-dom";
import styles from "./Account.module.css";
import { clearSession, getSessionUser, getToken } from "../lib/auth";
import TopCategories from "../components/home/TopCategories";
import MostSelling from "../components/home/MostSelling";
import WeeklyPopular from "../components/home/WeeklyPopular";
import BestDeals from "../components/home/BestDeals";
import logo from "../assets/acctpage.png";

export default function Account() {
  const navigate = useNavigate();
  const user = getSessionUser();
  const token = getToken();
  const signedIn = Boolean(user && token);
  const displayName =
    user?.name?.trim() ||
    (user?.email ? String(user.email).split("@")[0] : "there");

  function signOut() {
    clearSession();
    navigate("/account-signin");
  }

  if (!signedIn) {
    return (
      <section className={styles.page}>
        <article className={styles.card}>
          <p className={styles.kicker}>Account</p>
          <h1 className={styles.title}>You are not signed in</h1>
          <p className={styles.subtitle}>
            Sign in to access your account dashboard, orders, and seller tools.
          </p>
          <div className={styles.actions}>
            <Link to="/account-signin" className={styles.btn}>
              Sign in
            </Link>
            <Link to="/account-signup" className={styles.btnAlt}>
              Create account
            </Link>
          </div>
        </article>
      </section>
    );
  }

  if (user.role !== "BUYER") {
    return (
      <section className={styles.page}>
        <article className={styles.card}>
          <p className={styles.kicker}>Account</p>
          <h1 className={styles.title}>Welcome, {displayName}</h1>
          <p className={styles.subtitle}>Your account session is active.</p>
          <div className={styles.list}>
            <div className={styles.item}>
              <strong>Role:</strong> {user.role}
            </div>
            <div className={styles.item}>
              <strong>User ID:</strong> {user.id}
            </div>
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.btn} onClick={signOut}>
              Sign out
            </button>
            <Link to="/" className={styles.btnAlt}>
              Continue shopping
            </Link>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <article className={styles.heroCard}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>Buyer Dashboard</p>
          <h1 className={styles.title}>Welcome, {displayName}</h1>
          <p className={styles.subtitle}>
            Here at DaveDeals we sell value and you buy value. Explore
            handpicked sections made for you.
          </p>
        </div>
        <img src={logo} alt="DaveDeals" className={styles.heroLogo} />
      </article>

      <div className={styles.moduleWrap}>
        <WeeklyPopular />
      </div>
      <div className={styles.moduleWrap}>
        <TopCategories />
      </div>
      <div className={styles.moduleWrap}>
        <MostSelling />
      </div>
      <div className={styles.moduleWrap}>
        <BestDeals />
      </div>

      <article className={styles.endCard}>
        <h3>Seems you still want to explore our catalog</h3>
        <p>We sell value and you buy value. Welcome to DaveDeals.</p>
        <div className={styles.actions}>
          <button type="button" className={styles.btn} onClick={signOut}>
            Sign out
          </button>
          <Link to="/" className={styles.btnAlt}>
            Continue shopping
          </Link>
        </div>
      </article>
    </section>
  );
}
