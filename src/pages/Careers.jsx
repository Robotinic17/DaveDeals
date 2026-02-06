import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Rocket, Sparkles, Target, Users, TrendingUp } from "lucide-react";
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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const slideLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
};

const slideRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const inView = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export default function Careers() {
  const { t } = useTranslation();

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <motion.div
          className={styles.heroText}
          initial="hidden"
          animate="visible"
          variants={slideLeft}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
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
        </motion.div>
        <motion.div
          className={styles.heroMedia}
          initial="hidden"
          animate="visible"
          variants={slideRight}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <img src={meetingImg} alt={t("careers.heroImageAlt")} />
        </motion.div>
      </div>

      <div className={styles.inner}>
        <motion.div className={styles.valuesSection} {...inView} variants={stagger}>
          <motion.div className={styles.valuesHeader} variants={fadeUp}>
            <h2>{t("careers.values.title")}</h2>
            <p>{t("careers.values.subtitle")}</p>
          </motion.div>
          <motion.div className={styles.valuesGrid} variants={stagger}>
            <motion.article
              className={`${styles.valueCard} ${styles.valueCardGold}`}
              variants={fadeUp}
            >
              <div
                className={`${styles.valueIcon} ${styles.valueIconGold}`}
                aria-hidden="true"
              >
                <Target />
              </div>
              <h3>{t("careers.values.items.mission.title")}</h3>
              <p>{t("careers.values.items.mission.body")}</p>
            </motion.article>
            <motion.article className={styles.valueCard} variants={fadeUp}>
              <div
                className={`${styles.valueIcon} ${styles.valueIconSky}`}
                aria-hidden="true"
              >
                <Users />
              </div>
              <h3>{t("careers.values.items.team.title")}</h3>
              <p>{t("careers.values.items.team.body")}</p>
            </motion.article>
            <motion.article className={styles.valueCard} variants={fadeUp}>
              <div
                className={`${styles.valueIcon} ${styles.valueIconLavender}`}
                aria-hidden="true"
              >
                <Sparkles />
              </div>
              <h3>{t("careers.values.items.curiosity.title")}</h3>
              <p>{t("careers.values.items.curiosity.body")}</p>
            </motion.article>
            <motion.article
              className={`${styles.valueCard} ${styles.valueCardMint}`}
              variants={fadeUp}
            >
              <div
                className={`${styles.valueIcon} ${styles.valueIconMint}`}
                aria-hidden="true"
              >
                <Rocket />
              </div>
              <h3>{t("careers.values.items.create.title")}</h3>
              <p>{t("careers.values.items.create.body")}</p>
            </motion.article>
          </motion.div>
        </motion.div>

        <motion.div className={styles.beliefSection} {...inView}>
          <motion.div className={styles.beliefCopy} variants={slideLeft}>
            <h2>{t("careers.belief.title")}</h2>
            <span className={styles.beliefIcon} aria-hidden="true">
              <TrendingUp />
            </span>
          </motion.div>
          <motion.div className={styles.beliefBody} variants={slideRight}>
            <p>{t("careers.belief.body1")}</p>
            <p>{t("careers.belief.body2")}</p>
            <p>{t("careers.belief.body3")}</p>
          </motion.div>
        </motion.div>

        <motion.div className={styles.storySection} {...inView}>
          <motion.div className={styles.storyCard} variants={slideLeft}>
            <img src={processImg} alt={t("careers.story.imageAlt")} />
          </motion.div>
          <motion.div className={styles.quoteCard} variants={slideRight}>
            <p className={styles.quote}>{t("careers.quote.text")}</p>
            <div className={styles.quoteFooter}>
              <img src={founderImg} alt={t("careers.quote.author")} />
              <div>
                <strong>{t("careers.quote.author")}</strong>
                <span>{t("careers.quote.role")}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div className={styles.ctaBanner} {...inView} variants={fadeUp}>
          <div>
            <h2>{t("careers.cta.title")}</h2>
            <p>{t("careers.cta.subtitle")}</p>
          </div>
          <a className={styles.ctaBtn} href="#open-roles">
            {t("careers.primaryCta")}
          </a>
        </motion.div>

        <motion.div id="open-roles" className={styles.roles} {...inView}>
          <motion.div className={styles.rolesHeader} variants={fadeUp}>
            <h2>{t("careers.rolesTitle")}</h2>
            <p>{t("careers.rolesSubtitle")}</p>
          </motion.div>
          <motion.div className={styles.roleList} variants={stagger}>
            {ROLE_KEYS.map((key) => (
              <motion.div key={key} className={styles.roleCard} variants={fadeUp}>
                <div>
                  <h4 className={styles.roleTitle}>
                    {t(`careers.roles.${key}.title`)}
                  </h4>
                  <p className={styles.roleMeta}>
                    {t(`careers.roles.${key}.type`)} -{" "}
                    {t(`careers.roles.${key}.location`)}
                  </p>
                  <p className={styles.roleBody}>
                    {t(`careers.roles.${key}.summary`)}
                  </p>
                </div>
                <button type="button" className={styles.roleBtn}>
                  {t("careers.apply")}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
