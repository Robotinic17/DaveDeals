import logo from "../assets/logo.png";
import meetingImg from "../assets/meeting.jpg";
import processImg from "../assets/process.jpg";
import chatgptImg from "../assets/CHATGPT.gif";
import visionImg from "../assets/vision.webp";
import { useTranslation } from "react-i18next";
import styles from "./About.module.css";

const SECTION_KEYS = ["whoWeAre", "whatWeDo", "vision"];

const FEATURE_BLOCKS = [
  {
    key: "vision",
    imageSrc: visionImg,
    layout: "text-image",
  },
  {
    key: "approach",
    imageSrc: meetingImg,
    layout: "image-text",
  },
  {
    key: "process",
    imageSrc: processImg,
    layout: "text-image",
  },
];

function FeatureBlock({ block }) {
  return (
    <div
      className={`${styles.feature} ${
        block.layout === "image-text" ? styles.featureReverse : ""
      }`}
    >
      <div className={styles.featureText}>
        <h3 className={styles.featureTitle}>{block.title}</h3>
        <p className={styles.featureBody}>{block.text}</p>
        <div className={styles.featureAccent} />
      </div>
      <div className={styles.featureImage}>
        <img src={block.imageSrc} alt={block.imageAlt} loading="lazy" />
      </div>
    </div>
  );
}

export default function About() {
  const { t } = useTranslation();

  return (
    <section className={styles.page}>
      <img src={logo} alt={t("about.logoAlt")} className={styles.heroLogo} />
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.title}>{t("about.title")}</h1>
          <p className={styles.subtitle}>{t("about.subtitle")}</p>
        </div>
        <div className={styles.heroImage}>
          <img src={chatgptImg} alt={t("about.heroImageAlt")} loading="lazy" />
        </div>
      </div>

      <div className={styles.inner}>
        <div className={styles.cards}>
          {SECTION_KEYS.map((key) => (
            <div key={key} className={styles.card}>
              <h2 className={styles.cardTitle}>
                {t(`about.sections.${key}.title`)}
              </h2>
              <p className={styles.cardBody}>
                {t(`about.sections.${key}.body`)}
              </p>
            </div>
          ))}
        </div>

        <div className={styles.features}>
          {FEATURE_BLOCKS.map((block) => (
            <FeatureBlock
              key={block.key}
              block={{
                ...block,
                title: t(`about.features.${block.key}.title`),
                text: t(`about.features.${block.key}.text`),
                imageAlt: t(`about.features.${block.key}.imageAlt`),
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
