import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.code}>404</h1>
        <p className={styles.title}>Page not found</p>
        <p className={styles.text}>
          The page you’re looking for doesn’t exist or was moved.
        </p>

        <Link to="/" className={styles.button}>
          Back Home
        </Link>
      </div>
    </div>
  );
}
