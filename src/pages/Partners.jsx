import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Handshake,
  ShieldCheck,
  Truck,
  LineChart,
  Mail,
  Phone,
  ClipboardCheck,
  Globe,
} from "lucide-react";
import styles from "./Partners.module.css";
import logoImg from "../assets/logo.png";
import faviconImg from "../assets/favicon.png";
import aerolinkLogo from "../assets/ChatGPT Image Feb 7, 2026, 03_31_21 PM.png";

const benefits = [
  {
    title: "Reliable last-mile delivery",
    body: "Orders are picked up quickly and delivered with consistent handling and updates.",
    icon: Truck,
  },
  {
    title: "Operational transparency",
    body: "Live status, routing, and timeline events keep customers informed end-to-end.",
    icon: ShieldCheck,
  },
  {
    title: "Growth-ready collaboration",
    body: "We align on service levels, shared goals, and scalability from day one.",
    icon: LineChart,
  },
  {
    title: "Partner support",
    body: "Dedicated coordination and clear escalation paths for shared success.",
    icon: Handshake,
  },
];

const faqs = [
  {
    question: "Who can partner with DaveDeals?",
    answer:
      "We welcome logistics, fulfillment, and retail partners who can deliver consistent quality, clear communication, and reliable service coverage.",
  },
  {
    question: "What regions are supported?",
    answer:
      "We are expanding coverage and can work with regional partners. Coverage and SLAs are agreed during onboarding.",
  },
  {
    question: "How does partner onboarding work?",
    answer:
      "We start with a capability review, align on service terms, then run a short pilot before full rollout.",
  },
  {
    question: "Is there an integration required?",
    answer:
      "Yes. Partners exchange order and tracking data through an API or secure data feed.",
  },
];

export default function Partners() {
  const [activeTab, setActiveTab] = useState("aerolink");

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>Affiliate & Partners</p>
          <h1 className={styles.title}>Partnerships that move real value</h1>
          <p className={styles.subtitle}>
            DaveDeals partners with logistics and retail operators to deliver a
            premium experience for buyers and consistent growth for sellers.
            We are actively seeking new partnerships for regional coverage and
            fulfillment excellence.
          </p>
          <div className={styles.heroActions}>
            <a
              className={styles.primaryBtn}
              href="mailto:davedealsbiz@gmail.com"
            >
              <Mail size={16} /> Partner with us
            </a>
            <a className={styles.secondaryBtn} href="tel:+2348143791465">
              <Phone size={16} /> Call
            </a>
          </div>
        </div>
        <div className={styles.heroCard}>
          <div className={styles.cardHeader}>
            <ClipboardCheck size={18} />
            <span>Partnership snapshot</span>
          </div>
          <div className={styles.cardGrid}>
            <div>
              <span className={styles.label}>Response time</span>
              <span className={styles.value}>1 business day</span>
            </div>
            <div>
              <span className={styles.label}>Launch target</span>
              <span className={styles.value}>June 30, 2026</span>
            </div>
            <div>
              <span className={styles.label}>Coverage focus</span>
              <span className={styles.value}>Regional + Cross-border</span>
            </div>
            <div>
              <span className={styles.label}>Model</span>
              <span className={styles.value}>B2B logistics + marketplace</span>
            </div>
          </div>
          <p className={styles.cardNote}>
            We collaborate with partners who share our quality standards and
            customer-first mindset.
          </p>
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <h2>Why partner with DaveDeals</h2>
        <p>
          A partnership designed around reliability, accountability, and shared
          success.
        </p>
      </div>
      <div className={styles.benefitsGrid}>
        {benefits.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <Icon size={20} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          );
        })}
      </div>

      <div className={styles.sectionHeader}>
        <h2>Our logistics partner</h2>
        <p>
          We are partnered with Aerolink to manage shipment tracking and
          delivery operations.
        </p>
      </div>

      <div className={styles.partnerTabs}>
        <button
          type="button"
          className={`${styles.tabBtn} ${
            activeTab === "aerolink" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("aerolink")}
        >
          Aerolink Tracking System
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${
            activeTab === "opportunity" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("opportunity")}
        >
          Open partnership opportunities
        </button>
      </div>

      {activeTab === "aerolink" ? (
        <div className={styles.partnerCard}>
          <div className={styles.partnerHeader}>
            <img src={aerolinkLogo} alt="Aerolink logo" />
            <div>
              <h3>Aerolink Tracking System</h3>
              <p>
                A full-stack logistics tracking platform built for real-world
                shipment management, combining a premium public tracking
                experience with a protected admin dashboard.
              </p>
            </div>
          </div>
          <div className={styles.partnerGrid}>
            <div>
              <h4>Public tracking experience</h4>
              <ul>
                <li>Shipment tracking via tracking ID</li>
                <li>Status, route, sender/receiver details</li>
                <li>Timeline events and metadata</li>
              </ul>
            </div>
            <div>
              <h4>Admin operations</h4>
              <ul>
                <li>Protected admin access</li>
                <li>Create and edit shipments</li>
                <li>Status updates and auto-timeline events</li>
              </ul>
            </div>
            <div>
              <h4>Advanced controls</h4>
              <ul>
                <li>Search, filtering, pagination</li>
                <li>Archive / unarchive support</li>
                <li>Strict status enforcement</li>
              </ul>
            </div>
          </div>
          <div className={styles.partnerFoot}>
            <div>
              <span className={styles.label}>Integration model</span>
              <span className={styles.value}>API + admin workflow</span>
            </div>
            <Link to="/news" className={styles.secondaryBtn}>
              View updates
            </Link>
          </div>
        </div>
      ) : (
        <div className={styles.partnerCard}>
          <div className={styles.partnerHeader}>
            <div>
              <h3>We are actively looking for partners</h3>
              <p>
                If you handle logistics, fulfillment, warehousing, or regional
                delivery operations, we would love to collaborate.
              </p>
            </div>
          </div>
          <div className={styles.opportunityGrid}>
            <div>
              <h4>What we need</h4>
              <ul>
                <li>Reliable regional coverage</li>
                <li>Fast pickup and last-mile delivery</li>
                <li>Tracking visibility for customers</li>
              </ul>
            </div>
            <div>
              <h4>What you get</h4>
              <ul>
                <li>Consistent shipment volume</li>
                <li>Long-term partnership opportunities</li>
                <li>Joint growth and shared success metrics</li>
              </ul>
            </div>
          </div>
          <div className={styles.partnerFoot}>
            <a
              className={styles.primaryBtn}
              href="mailto:davedealsbiz@gmail.com"
            >
              Apply for partnership
            </a>
          </div>
        </div>
      )}

      <div className={styles.sectionHeader}>
        <h2>Media and brand assets</h2>
        <p>
          Download approved DaveDeals assets for co-marketing and partnership
          use.
        </p>
      </div>
      <div className={styles.mediaGrid}>
        <div className={styles.mediaCard}>
          <img src={logoImg} alt="DaveDeals logo" />
          <div>
            <h3>Primary logo</h3>
            <p>High-resolution logo for light backgrounds.</p>
          </div>
          <a className={styles.downloadBtn} href={logoImg} download>
            Download
          </a>
        </div>
        <div className={styles.mediaCard}>
          <img src={faviconImg} alt="DaveDeals favicon" />
          <div>
            <h3>Logo mark</h3>
            <p>Compact mark for app icons and social profiles.</p>
          </div>
          <a className={styles.downloadBtn} href={faviconImg} download>
            Download
          </a>
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <h2>FAQs</h2>
        <p>Answers to the most common partnership questions.</p>
      </div>
      <div className={styles.faqList}>
        {faqs.map((item) => (
          <details key={item.question} className={styles.faqItem}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>

      <div className={styles.ctaBanner}>
        <div>
          <h2>Ready to partner with DaveDeals?</h2>
          <p>
            Reach out to discuss coverage, integration, and joint growth
            opportunities.
          </p>
        </div>
        <div className={styles.ctaActions}>
          <a href="mailto:davedealsbiz@gmail.com" className={styles.primaryBtn}>
            Email partnership team
          </a>
          <a href="tel:+2348143791465" className={styles.secondaryBtn}>
            Call now
          </a>
        </div>
      </div>
    </section>
  );
}
