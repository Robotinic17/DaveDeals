import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Careers.module.css";
import meetingImg from "../assets/meeting.jpg";

const ROLE_KEYS = [
  "growthMarketer",
  "frontendEngineer",
  "backendEngineer",
  "fullstackEngineer",
  "devopsEngineer",
];

export default function Careers() {
  const { t } = useTranslation();

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>{t("careers.kicker")}</p>
          <h1 className={styles.title}>{t("careers.title")}</h1>
          <p className={styles.subtitle}>{t("careers.subtitle")}</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryBtn} href="#open-roles">
              {t("careers.primaryCta")}
            </a>
            <Link className={styles.secondaryBtn} to="/about">
              {t("careers.secondaryCta")}
            </Link>
          </div>
        </div>
        <div className={styles.heroMedia}>
          <img src={meetingImg} alt={t("careers.heroImageAlt")} />
        </div>
      </div>

      <div className={styles.inner}>
        <div id="open-roles" className={styles.roles}>
          <div className={styles.rolesHeader}>
            <h2>{t("careers.rolesTitle")}</h2>
            <p>{t("careers.rolesSubtitle")}</p>
          </div>
          <div className={styles.roleList}>
            {ROLE_KEYS.map((key) => (
              <div key={key} className={styles.roleCard}>
                <div>
                  <h4 className={styles.roleTitle}>
                    {t(`careers.roles.${key}.title`)}
                  </h4>
                  <p className={styles.roleMeta}>
                    {t(`careers.roles.${key}.type`)} -
                    {" "}
                    {t(`careers.roles.${key}.location`)}
                  </p>
                  <p className={styles.roleBody}>
                    {t(`careers.roles.${key}.summary`)}
                  </p>
                </div>
                <button type="button" className={styles.roleBtn}>
                  {t("careers.apply")}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
