import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./NotFound.module.css";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.code}>404</h1>
        <p className={styles.title}>{t("notFound.title")}</p>
        <p className={styles.text}>{t("notFound.text")}</p>

        <Link to="/" className={styles.button}>
          {t("notFound.backHome")}
        </Link>
      </div>
    </div>
  );
}
