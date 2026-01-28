import { useUnsplashImage } from "../hooks/useUnsplashImage";
import logo from "../assets/logo.png";
import styles from "./About.module.css";

const SECTIONS = [
  {
    title: "Who We Are",
    body:
      "DaveDeals is a marketplace built for both buyers and sellers. We focus on clarity, value, and a smooth path to discovery so you can shop confidently and compare options quickly.",
  },
  {
    title: "What We Do",
    body:
      "We organize products across brands, highlight standout deals, and make it easy to start selling. Whether you are exploring new brands or running a business, DaveDeals helps you find the right fit.",
  },
  {
    title: "Our Vision",
    body:
      "Our vision is to create a marketplace where buyers and sellers make deals directly. You can start your business, choose from the brands you want, and ensure you get the most from every product.",
  },
];

const FEATURE_BLOCKS = [
  {
    title: "Our Vision",
    text:
      "We’re creating a marketplace where buyers and sellers connect directly, build lasting relationships, and grow with confidence. Every decision is focused on fairness, transparency, and real value for both sides.",
    imageAlt: "Team collaboration",
    imageQuery: "team collaboration modern office",
    layout: "text-image",
  },
  {
    title: "Our Approach",
    text:
      "We put trust, clarity, and value first. Our experience is built to cut the noise, surface the best options, and help you compare quickly without feeling overwhelmed.",
    imageAlt: "Curated shopping experience",
    imageQuery: "curated shopping flat lay products",
    layout: "image-text",
  },
  {
    title: "Our Process",
    text:
      "We listen closely, test constantly, and improve relentlessly. That means smarter discovery, better recommendations, and a storefront that stays fresh every time you visit.",
    imageAlt: "Product workflow",
    imageQuery: "product planning workspace notebook",
    layout: "text-image",
  },
];

function FeatureBlock({ block, index }) {
  const { image } = useUnsplashImage(
    block.imageQuery,
    `about-${block.title.toLowerCase().replace(/\s+/g, "-")}`,
  );

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
        {image?.url ? (
          <img src={image.url} alt={block.imageAlt} loading="lazy" />
        ) : (
          <div className={styles.imagePlaceholder}>Image loading</div>
        )}
      </div>
      {image && (
        <p className={styles.credit}>
          Photo by{" "}
          <a href={image.userLink} target="_blank" rel="noreferrer">
            {image.name}
          </a>{" "}
          on{" "}
          <a href={image.unsplashLink} target="_blank" rel="noreferrer">
            Unsplash
          </a>
        </p>
      )}
    </div>
  );
}

export default function About() {
  const { image: heroImage } = useUnsplashImage(
    "modern ecommerce team workspace",
    "about-hero",
  );

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <img src={logo} alt="DaveDeals" className={styles.heroLogo} />
          <h1 className={styles.title}>About DaveDeals</h1>
          <p className={styles.subtitle}>
            Built to help you discover better deals with less effort.
          </p>
        </div>
        <div className={styles.heroImage}>
          {heroImage?.url ? (
            <img src={heroImage.url} alt="DaveDeals team" loading="lazy" />
          ) : (
            <div className={styles.imagePlaceholder}>Loading</div>
          )}
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
          {FEATURE_BLOCKS.map((block, index) => (
            <FeatureBlock key={block.title} block={block} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
