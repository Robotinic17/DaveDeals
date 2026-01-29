import { useTranslation } from "react-i18next";
import styles from "./CashBackBanner.module.css";
import cardsImg from "../../assets/cards.png";

export default function CashBackBanner() {
  const { t } = useTranslation();

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <h2 className={styles.title}>{t("home.cashBack.title")}</h2>
          <p className={styles.sub}>{t("home.cashBack.subtitle")}</p>
          <button type="button" className={styles.cta}>
            {t("home.cashBack.cta")}
          </button>
        </div>
        <div className={styles.media}>
          <img
            src={cardsImg}
            alt={t("home.cashBack.imageAlt")}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
