import { Link } from "react-router-dom";
import styles from "./Forbidden.module.css";
import { getSessionUser } from "../lib/auth";

export default function Forbidden() {
  const user = getSessionUser();

  return (
    <section className={styles.page}>
      <article className={styles.card}>
        <p className={styles.kicker}>Restricted</p>
        <h1 className={styles.title}>You do not have access to this page</h1>
        <p className={styles.subtitle}>
          {user?.role
            ? `Your current account role is ${user.role}.`
            : "This area requires a signed-in account with the correct role."}
        </p>
        <div className={styles.actions}>
          <Link to="/" className={styles.primaryBtn}>
            Go home
          </Link>
          <Link to="/account" className={styles.secondaryBtn}>
            Open account
          </Link>
        </div>
      </article>
    </section>
  );
}
