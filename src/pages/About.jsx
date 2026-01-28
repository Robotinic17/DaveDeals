import logo from "../assets/logo.png";
import meetingImg from "../assets/meeting.jpg";
import processImg from "../assets/process.jpg";
import chatgptImg from "../assets/CHATGPT.gif";
import visionImg from "../assets/vision.webp";
import styles from "./About.module.css";

const SECTIONS = [
  {
    title: "Who We Are",
    body: "DaveDeals is a marketplace built for both buyers and sellers. We focus on clarity, value, and a smooth path to discovery so you can shop confidently and compare options quickly.",
  },
  {
    title: "What We Do",
    body: "We organize products across brands, highlight standout deals, and make it easy to start selling. Whether you are exploring new brands or running a business, DaveDeals helps you find the right fit.",
  },
  {
    title: "Our Vision",
    body: "Our vision is to create a marketplace where buyers and sellers make deals directly. You can start your business, choose from the brands you want, and ensure you get the most from every product.",
  },
];

const FEATURE_BLOCKS = [
  {
    title: "Our Vision",
    text: "We are creating a marketplace where buyers and sellers connect directly, build lasting relationships, and grow with confidence. Every decision is focused on fairness, transparency, and real value for both sides.",
    imageAlt: "Creator tools and smart commerce",
    imageSrc: visionImg,
    layout: "text-image",
  },
  {
    title: "Our Approach",
    text: "We put trust, clarity, and value first. Our experience is built to cut the noise, surface the best options, and help you compare quickly without feeling overwhelmed.",
    imageAlt: "Team collaboration meeting",
    imageSrc: meetingImg,
    layout: "image-text",
  },
  {
    title: "Our Process",
    text: "We listen closely, test constantly, and improve relentlessly. That means smarter discovery, better recommendations, and a storefront that stays fresh every time you visit.",
    imageAlt: "Process and planning",
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
  return (
    <section className={styles.page}>
      <img src={logo} alt="DaveDeals" className={styles.heroLogo} />
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.title}>About DaveDeals</h1>
          <p className={styles.subtitle}>
            Built to help you discover better deals with less effort, faster
            decisions, and more confidence every time you shop.
          </p>
        </div>
        <div className={styles.heroImage}>
          <img src={chatgptImg} alt="DaveDeals team" loading="lazy" />
        </div>
      </div>

      <div className={styles.inner}>
        <div className={styles.cards}>
          {SECTIONS.map((section) => (
            <div key={section.title} className={styles.card}>
              <h2 className={styles.cardTitle}>{section.title}</h2>
              <p className={styles.cardBody}>{section.body}</p>
            </div>
          ))}
        </div>

        <div className={styles.features}>
          {FEATURE_BLOCKS.map((block) => (
            <FeatureBlock key={block.title} block={block} />
          ))}
        </div>
      </div>
    </section>
  );
}
