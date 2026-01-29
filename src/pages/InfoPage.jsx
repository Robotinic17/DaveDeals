import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./InfoPage.module.css";

export default function InfoPage({ pageKey }) {
  const { t } = useTranslation();
  const page = t(`info.pages.${pageKey}`, { returnObjects: true });

  if (!page || typeof page !== "object" || !page.title) {
    return (
      <section className={styles.page}>
        <div className={styles.inner}>
          <h1 className={styles.title}>{t("info.notFound.title")}</h1>
          <p className={styles.subtitle}>{t("info.notFound.subtitle")}</p>
          <Link to="/" className={styles.backBtn}>
            {t("info.notFound.cta")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.kicker}>{t("info.kicker")}</p>
        <h1 className={styles.title}>{page.title}</h1>
        <p className={styles.subtitle}>{page.subtitle}</p>

        <div className={styles.grid}>
          {(page.sections || []).map((section, idx) => (
            <div
              key={`${pageKey}-${section?.title || "section"}-${idx}`}
              className={styles.card}
            >
              <h2 className={styles.cardTitle}>{section.title}</h2>
              <p className={styles.cardBody}>{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
