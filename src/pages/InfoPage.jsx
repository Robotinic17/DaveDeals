import { Link } from "react-router-dom";
import styles from "./InfoPage.module.css";

const PAGES = {
  about: {
    title: "About DaveDeals",
    subtitle: "Built to help you discover better deals with less effort.",
    sections: [
      {
        title: "Who We Are",
        body:
          "DaveDeals brings together a broad catalog so you can compare, explore, and shop with confidence. We prioritize clarity, quality, and a simple experience.",
      },
      {
        title: "What We Do",
        body:
          "We highlight daily and weekly picks, organize categories intelligently, and make discovery fast so you can get to the right products quickly.",
      },
    ],
  },
  careers: {
    title: "Careers",
    subtitle: "Help build the next generation of smart shopping.",
    sections: [
      {
        title: "Our Culture",
        body:
          "We move fast, stay customer-obsessed, and focus on clean design and thoughtful engineering.",
      },
      {
        title: "Open Roles",
        body:
          "We are growing across product, design, and engineering. Check back soon for updated openings.",
      },
    ],
  },
  news: {
    title: "News & Blog",
    subtitle: "Product drops, shopping tips, and behind-the-scenes updates.",
    sections: [
      {
        title: "Highlights",
        body:
          "Our blog features trend spotlights, buyer guides, and curated picks across categories.",
      },
    ],
  },
  help: {
    title: "Help Center",
    subtitle: "Find answers fast and get the support you need.",
    sections: [
      {
        title: "Common Questions",
        body:
          "Get help with orders, delivery, returns, and account questions. We keep this page updated with the most common topics.",
      },
    ],
  },
  press: {
    title: "Press Center",
    subtitle: "Resources for media and brand inquiries.",
    sections: [
      {
        title: "Press Requests",
        body:
          "For press coverage and partnerships, reach out to our team. We love collaborating with great partners.",
      },
    ],
  },
  locations: {
    title: "Shop by Location",
    subtitle: "Find products and delivery options near you.",
    sections: [
      {
        title: "Local Discovery",
        body:
          "Explore categories and availability based on your area. We’re expanding coverage regularly.",
      },
    ],
  },
  brands: {
    title: "Brands",
    subtitle: "Discover top brands across every category.",
    sections: [
      {
        title: "Featured Brands",
        body:
          "Browse popular brands and discover new favorites with reliable reviews and standout value.",
      },
    ],
  },
  partners: {
    title: "Affiliate & Partners",
    subtitle: "Let’s build the future of commerce together.",
    sections: [
      {
        title: "Partner With Us",
        body:
          "We work with affiliates, creators, and merchants to build best-in-class shopping experiences.",
      },
    ],
  },
  guides: {
    title: "Ideas & Guides",
    subtitle: "Curated buying guides to make decisions easier.",
    sections: [
      {
        title: "Guides",
        body:
          "From seasonal collections to category deep-dives, our guides help you shop confidently.",
      },
    ],
  },
};

export default function InfoPage({ pageKey }) {
  const page = PAGES[pageKey];

  if (!page) {
    return (
      <section className={styles.page}>
        <div className={styles.inner}>
          <h1 className={styles.title}>Page not found</h1>
          <p className={styles.subtitle}>
            This page isn&apos;t available yet. Try another destination.
          </p>
          <Link to="/" className={styles.backBtn}>
            Back to home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.kicker}>DaveDeals</p>
        <h1 className={styles.title}>{page.title}</h1>
        <p className={styles.subtitle}>{page.subtitle}</p>

        <div className={styles.grid}>
          {page.sections.map((section) => (
            <div key={section.title} className={styles.card}>
              <h2 className={styles.cardTitle}>{section.title}</h2>
              <p className={styles.cardBody}>{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

