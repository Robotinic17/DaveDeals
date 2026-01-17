import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import styles from "./Home.module.css";
import TopCategories from "../components/home/TopCategories";
import stage from "../assets/stage.png";
import travel from "../assets/travel.png";
import gadgets from "../assets/gadgets.png";
import snack from "../assets/snack.png";
import bags from "../assets/bags.png";

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.inner}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={styles.left}
          >
            <h1 className={`${styles.title} heading`}>{t("home.heroTitle")}</h1>

            <p className={styles.subtitle}>{t("home.heroSubtitle")}</p>

            <div className={styles.ctaRow}>
              <button type="button" className={styles.cta}>
                {t("home.heroCta")}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
            className={styles.right}
          >
            <img className={styles.heroImage} src={stage} alt="stage" />
          </motion.div>
        </div>
      </section>
      <TopCategories />
    </>
  );
}
