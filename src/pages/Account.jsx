import { Link, useNavigate } from "react-router-dom";
import styles from "./Account.module.css";
import { clearSession, getSessionUser, getToken } from "../lib/auth";

export default function Account() {
  const navigate = useNavigate();
  const user = getSessionUser();
  const token = getToken();
  const signedIn = Boolean(user && token);

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
            <Link to="/account-signin" className={styles.btn}>Sign in</Link>
            <Link to="/account-signup" className={styles.btnAlt}>Create account</Link>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <article className={styles.card}>
        <p className={styles.kicker}>Account</p>
        <h1 className={styles.title}>Welcome, {user.email}</h1>
        <p className={styles.subtitle}>Your account session is active.</p>

        <div className={styles.list}>
          <div className={styles.item}><strong>Role:</strong> {user.role}</div>
          <div className={styles.item}><strong>User ID:</strong> {user.id}</div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.btn} onClick={signOut}>
            Sign out
          </button>
          <Link to="/" className={styles.btnAlt}>Continue shopping</Link>
        </div>
      </article>
    </section>
  );
}
