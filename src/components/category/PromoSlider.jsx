import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import styles from "./PromoSlider.module.css";

import ad1 from "../../assets/ads/ad-1.webp";
import ad2 from "../../assets/ads/ad-2.png";
import ad3 from "../../assets/ads/ad-3.png";

const SLIDE_MS = 5000;

const slideVariants = {
  enter: { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: "easeIn" } },
};

export default function PromoSlider() {
  const { t } = useTranslation();

  const slides = [
    {
      id: "ad1",
      title: t("promoSlider.slides.ad1.title"),
      title2: t("promoSlider.slides.ad1.title2"),
      cta: t("promoSlider.slides.ad1.cta"),
      image: ad1,
    },
    {
      id: "ad2",
      title: t("promoSlider.slides.ad2.title"),
      title2: t("promoSlider.slides.ad2.title2"),
      cta: t("promoSlider.slides.ad2.cta"),
      image: ad2,
    },
    {
      id: "ad3",
      title: t("promoSlider.slides.ad3.title"),
      title2: t("promoSlider.slides.ad3.title2"),
      cta: t("promoSlider.slides.ad3.cta"),
      image: ad3,
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_MS);

    return () => clearInterval(t);
  }, [slides.length]);

  const active = slides[index];

  return (
    <div className={styles.wrap}>
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          className={styles.slide}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          <div className={styles.left}>
            <p className={styles.kicker}>{t("promoSlider.kicker")}</p>
            <h2 className={styles.title}>
              {active.title} <br /> {active.title2}
            </h2>
            <button type="button" className={styles.cta}>
              {active.cta}
            </button>
          </div>

          <div className={styles.right}>
            <img className={styles.image} src={active.image} alt="" />
          </div>

          <div className={styles.dots} aria-hidden="true">
            {slides.map((s, i) => (
              <span
                key={s.id}
                className={`${styles.dot} ${
                  i === index ? styles.dotActive : ""
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
