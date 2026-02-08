import { useMemo, useState } from "react";
import { ArrowRight, Sparkles, Tag, Clock, SlidersHorizontal } from "lucide-react";
import styles from "./Guides.module.css";
import coverImg from "../assets/cover.jpg";
import gadgetsImg from "../assets/gadgets.png";
import travelImg from "../assets/travel.png";
import bagsImg from "../assets/bags.png";
import snackImg from "../assets/snack.png";
import stageImg from "../assets/stage.png";

const categories = ["All", "Buying", "Budget", "Trends", "Sellers", "Lifestyle"];

const guides = [
  {
    id: "guide-smart-value",
    title: "How to Spot Real Value in 60 Seconds",
    category: "Buying",
    readTime: "4 min",
    tag: "Best of DaveDeals",
    image: coverImg,
    excerpt:
      "A fast checklist for deal quality, seller trust, and price clarity—so you buy with confidence.",
    featured: true,
  },
  {
    id: "guide-budget-path",
    title: "Build a Budget Shopping Path That Works",
    category: "Budget",
    readTime: "5 min",
    tag: "New",
    image: snackImg,
    excerpt:
      "Map your monthly spending into categories and avoid impulse traps without missing out.",
  },
  {
    id: "guide-trend-radar",
    title: "Trend Radar: What’s Actually Worth It This Month",
    category: "Trends",
    readTime: "3 min",
    tag: "Popular",
    image: gadgetsImg,
    excerpt:
      "Cut through hype and discover which products deliver long-term value.",
  },
  {
    id: "guide-seller-start",
    title: "Seller Starter Kit: Your First 10 Listings",
    category: "Sellers",
    readTime: "6 min",
    tag: "For Sellers",
    image: stageImg,
    excerpt:
      "A simple framework for titles, pricing, and product photos that convert.",
  },
  {
    id: "guide-travel-pack",
    title: "Travel Essentials That Don’t Waste Space",
    category: "Lifestyle",
    readTime: "4 min",
    tag: "Seasonal",
    image: travelImg,
    excerpt:
      "Pack smarter with versatile items that deliver comfort and value.",
  },
  {
    id: "guide-bag-upgrade",
    title: "The Bag Upgrade: What to Buy Once",
    category: "Lifestyle",
    readTime: "4 min",
    tag: "Editor’s pick",
    image: bagsImg,
    excerpt:
      "Pick a bag that performs every day and still looks premium.",
  },
];

const tips = [
  "Check seller ratings and return windows before buying.",
  "Compare price history, not just the discount label.",
  "Use filters to narrow to the top 10% of options.",
  "Save items to watch for price drops.",
];

export default function Guides() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  const normalized = query.trim().toLowerCase();

  const filteredGuides = useMemo(() => {
    return guides.filter((guide) => {
      const matchesCategory =
        activeCategory === "All" || guide.category === activeCategory;
      const matchesQuery =
        !normalized ||
        `${guide.title} ${guide.category} ${guide.tag}`
          .toLowerCase()
          .includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, normalized]);

  const featured = guides.find((guide) => guide.featured) || guides[0];

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>Ideas & Guides</p>
          <h1 className={styles.title}>Shop smarter with curated guidance</h1>
          <p className={styles.subtitle}>
            Editorial insights, buying frameworks, and seller playbooks designed
            to help you make better decisions in less time.
          </p>
          <div className={styles.searchRow}>
            <div className={styles.searchInput}>
              <SlidersHorizontal size={18} />
              <input
                type="text"
                placeholder="Search guides"
                aria-label="Search guides"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <button type="button" className={styles.primaryBtn}>
              Explore all
            </button>
          </div>
          <div className={styles.tipRow}>
            <Sparkles size={16} />
            <span>{tips[Math.floor(Math.random() * tips.length)]}</span>
          </div>
        </div>
        <div className={styles.heroCard}>
          <img src={featured.image} alt={featured.title} decoding="async" />
          <div className={styles.heroOverlay}>
            <span className={styles.tag}>{featured.tag}</span>
            <h2>{featured.title}</h2>
            <p>{featured.excerpt}</p>
            <button type="button" className={styles.secondaryBtn}>
              Read guide <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterLabel}>
          <Tag size={14} />
          Categories
        </div>
        <div className={styles.filterChips}>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`${styles.chip} ${
                activeCategory === category ? styles.chipActive : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {filteredGuides.map((guide) => (
          <article key={guide.id} className={styles.card}>
            <div className={styles.cardMedia}>
              <img src={guide.image} alt={guide.title} loading="lazy" decoding="async" />
              <span className={styles.cardTag}>{guide.tag}</span>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardMeta}>
                <span>{guide.category}</span>
                <span>
                  <Clock size={12} /> {guide.readTime}
                </span>
              </div>
              <h3>{guide.title}</h3>
              <p>{guide.excerpt}</p>
              <button type="button" className={styles.linkBtn}>
                Read guide <ArrowRight size={14} />
              </button>
            </div>
          </article>
        ))}
        {filteredGuides.length === 0 && (
          <div className={styles.emptyState}>
            No guides match that filter. Try another category.
          </div>
        )}
      </div>
    </section>
  );
}

