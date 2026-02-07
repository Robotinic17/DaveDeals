import { Mail, Phone, Download, Sparkles, Globe, Briefcase } from "lucide-react";
import styles from "./PressCenter.module.css";
import logoImg from "../assets/logo.png";
import faviconImg from "../assets/favicon.png";
import founderImg from "../assets/CHATGPT.gif";

const pressReleases = [
  {
    title: "DaveDeals announces upcoming marketplace launch",
    date: "June 30, 2026",
    summary:
      "DaveDeals will officially launch its marketplace focused on clear pricing, standout value, and seller growth.",
  },
  {
    title: "Building a smarter discovery experience for buyers",
    date: "May 15, 2026",
    summary:
      "Product updates focus on faster discovery, trusted reviews, and curated deal highlights.",
  },
  {
    title: "Seller tools roadmap and early access plans",
    date: "April 22, 2026",
    summary:
      "DaveDeals shares its seller-first roadmap designed to help merchants grow quickly.",
  },
];

const milestones = [
  {
    title: "Founder-led marketplace vision",
    detail:
      "DaveDeals is led by Eluwole David Timileyin, focused on building a marketplace that benefits both buyers and sellers.",
  },
  {
    title: "Launch date announced",
    detail: "Public launch planned for June 30, 2026.",
  },
  {
    title: "Pre-launch build phase",
    detail:
      "Product, catalog structure, and seller tooling are actively in development.",
  },
];

export default function PressCenter() {
  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>Press Center</p>
          <h1 className={styles.title}>DaveDeals News, Media, and Investors</h1>
          <p className={styles.subtitle}>
            DaveDeals is a marketplace built for both buyers and sellers. We
            organize products across brands, highlight standout value, and make
            discovery feel simple and confident. Our mission is to create a
            marketplace where sellers grow faster and buyers find the best value
            without the noise.
          </p>
          <div className={styles.heroTags}>
            <span>
              <Globe size={14} /> Ecommerce Marketplace
            </span>
            <span>
              <Sparkles size={14} /> Value-First Discovery
            </span>
            <span>
              <Briefcase size={14} /> Seller Growth Tools
            </span>
          </div>
        </div>
        <div className={styles.contactCard}>
          <div className={styles.contactHeader}>
            <span>Press contact</span>
          </div>
          <div className={styles.contactBody}>
            <div>
              <p className={styles.contactLabel}>Name</p>
              <p className={styles.contactValue}>Eluwole David Timileyin</p>
              <p className={styles.contactSub}>Founder & CEO</p>
            </div>
            <div>
              <p className={styles.contactLabel}>Email</p>
              <p className={styles.contactValue}>davedealsbiz@gmail.com</p>
            </div>
            <div>
              <p className={styles.contactLabel}>Phone</p>
              <p className={styles.contactValue}>+2348143791465</p>
            </div>
            <div>
              <p className={styles.contactLabel}>Response time</p>
              <p className={styles.contactValue}>Within 1 business day</p>
            </div>
          </div>
          <div className={styles.contactActions}>
            <a href="mailto:davedealsbiz@gmail.com" className={styles.primaryBtn}>
              <Mail size={16} /> Email press
            </a>
            <a href="tel:+2348143791465" className={styles.secondaryBtn}>
              <Phone size={16} /> Call
            </a>
          </div>
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <h2>Company overview</h2>
        <p>
          DaveDeals helps buyers discover real value quickly while giving sellers
          the tools to grow with clarity. We focus on trusted pricing, better
          navigation, and a discovery flow that removes friction from the buying
          journey.
        </p>
      </div>

      <div className={styles.gridTwo}>
        <div className={styles.infoCard}>
          <h3>What we do</h3>
          <p>
            We organize products across brands, surface standout deals, and make
            it easy for sellers to reach the right buyers. DaveDeals is designed
            to feel curated, fast, and reliable.
          </p>
        </div>
        <div className={styles.infoCard}>
          <h3>Our vision</h3>
          <p>
            We are building a marketplace where buyers and sellers connect
            directly, compare offers with confidence, and transact without
            friction. Every product should be easy to understand and worth the
            time spent exploring.
          </p>
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <h2>Key milestones</h2>
        <p>Highlights of DaveDeals progress and upcoming launch plans.</p>
      </div>
      <div className={styles.milestones}>
        {milestones.map((item) => (
          <div key={item.title} className={styles.milestoneCard}>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </div>
        ))}
      </div>

      <div className={styles.sectionHeader}>
        <h2>Press releases</h2>
        <p>Official updates and company announcements.</p>
      </div>
      <div className={styles.releaseGrid}>
        {pressReleases.map((item) => (
          <div key={item.title} className={styles.releaseCard}>
            <p className={styles.releaseDate}>{item.date}</p>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <button type="button" className={styles.releaseBtn}>
              Read release
            </button>
          </div>
        ))}
      </div>

      <div className={styles.sectionHeader}>
        <h2>Media kit</h2>
        <p>Download logos and brand assets for press use.</p>
      </div>
      <div className={styles.mediaGrid}>
        <div className={styles.mediaCard}>
          <img src={logoImg} alt="DaveDeals logo" />
          <div>
            <h3>Primary logo</h3>
            <p>High-resolution logo for light backgrounds.</p>
          </div>
          <a className={styles.downloadBtn} href={logoImg} download>
            <Download size={16} /> Download
          </a>
        </div>
        <div className={styles.mediaCard}>
          <img src={faviconImg} alt="DaveDeals favicon" />
          <div>
            <h3>Favicon mark</h3>
            <p>Compact logo mark for icons and avatars.</p>
          </div>
          <a className={styles.downloadBtn} href={faviconImg} download>
            <Download size={16} /> Download
          </a>
        </div>
        <div className={styles.mediaCard}>
          <img src={founderImg} alt="Founder portrait" />
          <div>
            <h3>Founder portrait</h3>
            <p>Headshot for press coverage and announcements.</p>
          </div>
          <a className={styles.downloadBtn} href={founderImg} download>
            <Download size={16} /> Download
          </a>
        </div>
      </div>

      <div className={styles.coverageCard}>
        <div>
          <h2>Press coverage</h2>
          <p>
            We are currently in pre-launch. Coverage updates will appear here as
            they are published.
          </p>
        </div>
        <a href="mailto:davedealsbiz@gmail.com" className={styles.primaryBtn}>
          Share coverage
        </a>
      </div>
    </section>
  );
}
