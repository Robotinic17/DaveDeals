import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Careers.module.css";
import meetingImg from "../assets/meeting.jpg";
import processImg from "../assets/process.jpg";
import founderImg from "../assets/CHATGPT.gif";

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
        <div className={styles.valuesSection}>
          <div className={styles.valuesHeader}>
            <h2>{t("careers.values.title")}</h2>
            <p>{t("careers.values.subtitle")}</p>
          </div>
          <div className={styles.valuesGrid}>
            <article className={`${styles.valueCard} ${styles.valueCardGold}`}>
              <span className={styles.valueIcon} aria-hidden="true" />
              <h3>{t("careers.values.items.mission.title")}</h3>
              <p>{t("careers.values.items.mission.body")}</p>
            </article>
            <article className={styles.valueCard}>
              <span className={`${styles.valueIcon} ${styles.valueIconSwirl}`} aria-hidden="true" />
              <h3>{t("careers.values.items.team.title")}</h3>
              <p>{t("careers.values.items.team.body")}</p>
            </article>
            <article className={styles.valueCard}>
              <span className={`${styles.valueIcon} ${styles.valueIconCloud}`} aria-hidden="true" />
              <h3>{t("careers.values.items.curiosity.title")}</h3>
              <p>{t("careers.values.items.curiosity.body")}</p>
            </article>
            <article className={`${styles.valueCard} ${styles.valueCardMint}`}>
              <span className={`${styles.valueIcon} ${styles.valueIconArrow}`} aria-hidden="true" />
              <h3>{t("careers.values.items.create.title")}</h3>
              <p>{t("careers.values.items.create.body")}</p>
            </article>
          </div>
        </div>

        <div className={styles.beliefSection}>
          <div className={styles.beliefCopy}>
            <h2>{t("careers.belief.title")}</h2>
            <span className={styles.beliefMark} aria-hidden="true" />
          </div>
          <div className={styles.beliefBody}>
            <p>{t("careers.belief.body1")}</p>
            <p>{t("careers.belief.body2")}</p>
            <p>{t("careers.belief.body3")}</p>
          </div>
        </div>

        <div className={styles.storySection}>
          <div className={styles.storyCard}>
            <img src={processImg} alt={t("careers.story.imageAlt")} />
          </div>
          <div className={styles.quoteCard}>
            <p className={styles.quote}>{t("careers.quote.text")}</p>
            <div className={styles.quoteFooter}>
              <img src={founderImg} alt={t("careers.quote.author")} />
              <div>
                <strong>{t("careers.quote.author")}</strong>
                <span>{t("careers.quote.role")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.ctaBanner}>
          <div>
            <h2>{t("careers.cta.title")}</h2>
            <p>{t("careers.cta.subtitle")}</p>
          </div>
          <a className={styles.ctaBtn} href="#open-roles">
            {t("careers.primaryCta")}
          </a>
        </div>

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
