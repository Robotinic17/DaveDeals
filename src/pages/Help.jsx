import { useMemo, useState } from "react";
import {
  Search,
  Package,
  Truck,
  RotateCcw,
  CreditCard,
  User,
  Shield,
  Store,
  Gift,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import styles from "./Help.module.css";

const quickLinks = [
  {
    title: "Track an order",
    body: "Check shipping status and delivery updates in real time.",
    cta: "Track order",
    keywords: "tracking shipping delivery",
  },
  {
    title: "Start a return",
    body: "Begin a return, request a refund, or exchange an item.",
    cta: "Start return",
    keywords: "return refund exchange",
  },
  {
    title: "Payment support",
    body: "Get help with cards, failed payments, or billing issues.",
    cta: "View payments",
    keywords: "payment billing card",
  },
];

const categories = [
  {
    title: "Orders",
    body: "Order status, confirmations, and issues.",
    icon: Package,
    keywords: "order status confirmation",
  },
  {
    title: "Shipping & Delivery",
    body: "Shipping times, addresses, and tracking.",
    icon: Truck,
    keywords: "shipping delivery tracking",
  },
  {
    title: "Returns & Refunds",
    body: "Return windows, refunds, and exchanges.",
    icon: RotateCcw,
    keywords: "returns refunds exchange",
  },
  {
    title: "Payments",
    body: "Cards, wallets, and payment troubleshooting.",
    icon: CreditCard,
    keywords: "payment billing card wallet",
  },
  {
    title: "Account",
    body: "Profile, passwords, and preferences.",
    icon: User,
    keywords: "account profile password",
  },
  {
    title: "Security",
    body: "Fraud protection and account safety.",
    icon: Shield,
    keywords: "security fraud safety",
  },
  {
    title: "Sellers",
    body: "Selling tools, payouts, and store support.",
    icon: Store,
    keywords: "seller payout store",
  },
  {
    title: "Gift Cards",
    body: "Buy, redeem, or troubleshoot gift cards.",
    icon: Gift,
    keywords: "gift card redeem",
  },
];

const faqs = [
  {
    question: "Where is my order?",
    answer:
      "You can track your order from your account dashboard. If tracking has not updated in 48 hours, contact support and we will investigate.",
  },
  {
    question: "What is your return window?",
    answer:
      "Most items can be returned within 30 days of delivery. Items must be unused and in original packaging to qualify.",
  },
  {
    question: "How long do refunds take?",
    answer:
      "Refunds are processed within 3-5 business days after the item is received and inspected. Your bank may take additional time to post the credit.",
  },
  {
    question: "Can I change my delivery address?",
    answer:
      "If the order has not shipped, you can update the address from your account. Once shipped, address changes are limited.",
  },
  {
    question: "My payment failed. What should I do?",
    answer:
      "Confirm your billing details, try a different card, or contact your bank for authorization. If the issue persists, reach out to support.",
  },
];

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const inView = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, amount: 0.2 },
};

export default function Help() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const normalized = query.trim().toLowerCase();

  const filteredQuick = useMemo(() => {
    if (!normalized) return quickLinks;
    return quickLinks.filter((item) =>
      `${item.title} ${item.body} ${item.keywords}`
        .toLowerCase()
        .includes(normalized)
    );
  }, [normalized]);

  const filteredCategories = useMemo(() => {
    if (!normalized) return categories;
    return categories.filter((item) =>
      `${item.title} ${item.body} ${item.keywords}`
        .toLowerCase()
        .includes(normalized)
    );
  }, [normalized]);

  const filteredFaqs = useMemo(() => {
    if (!normalized) return faqs;
    return faqs.filter((item) =>
      `${item.question} ${item.answer}`.toLowerCase().includes(normalized)
    );
  }, [normalized]);

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <motion.div
          className={styles.heroText}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className={styles.kicker}>DaveDeals Help Center</p>
          <h1 className={styles.title}>How can we help you today?</h1>
          <p className={styles.subtitle}>
            Find quick answers, explore support topics, or contact our team. We
            respond within 1 business day.
          </p>
          <div className={styles.searchRow}>
            <div className={styles.searchInput}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Search help articles, topics, or orders"
                aria-label="Search help articles"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <button
              type="button"
              className={styles.searchBtn}
              onClick={() => setQuery(query.trim())}
            >
              Search
            </button>
          </div>
          {(normalized || activeCategory) && (
            <div className={styles.searchStatus} aria-live="polite">
              {activeCategory
                ? `Showing help for ${activeCategory}.`
                : `Showing results for "${query.trim()}".`}
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() => {
                  setQuery("");
                  setActiveCategory("");
                }}
              >
                Clear
              </button>
            </div>
          )}
        </motion.div>
        <motion.div
          className={styles.heroPanel}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <div className={styles.heroPanelHeader}>
            <MessageCircle size={18} />
            <span>Contact support</span>
          </div>
          <div className={styles.heroPanelBody}>
            <div>
              <p className={styles.heroPanelLabel}>Email</p>
              <p className={styles.heroPanelValue}>davedealsbiz@gmail.com</p>
            </div>
            <div>
              <p className={styles.heroPanelLabel}>Phone</p>
              <p className={styles.heroPanelValue}>+2348143791465</p>
            </div>
            <div>
              <p className={styles.heroPanelLabel}>Hours</p>
              <p className={styles.heroPanelValue}>Mon-Fri, 9:00am-5:00pm</p>
            </div>
          </div>
          <a
            className={styles.heroPanelCta}
            href="mailto:davedealsbiz@gmail.com"
          >
            Contact us
          </a>
        </motion.div>
      </div>

      <motion.div className={styles.sectionHeader} {...inView} variants={fadeUp}>
        <h2>Top tasks</h2>
        <p>Quick actions for the most common requests.</p>
      </motion.div>
      <motion.div className={styles.quickGrid} {...inView} variants={stagger}>
        {filteredQuick.map((item) => (
          <motion.div
            key={item.title}
            className={styles.quickCard}
            variants={fadeUp}
          >
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            <button
              type="button"
              className={styles.quickBtn}
              onClick={() => setActiveCategory(item.title)}
            >
              {item.cta}
            </button>
          </motion.div>
        ))}
        {filteredQuick.length === 0 && (
          <div className={styles.emptyState}>No quick actions match your search.</div>
        )}
      </motion.div>

      <motion.div className={styles.sectionHeader} {...inView} variants={fadeUp}>
        <h2>Browse by category</h2>
        <p>Find detailed guides and step-by-step articles.</p>
      </motion.div>
      <motion.div className={styles.categoryGrid} {...inView} variants={stagger}>
        {filteredCategories.map((item) => {
          const Icon = item.icon;
          const isActive = activeCategory === item.title;
          return (
            <motion.button
              type="button"
              key={item.title}
              className={`${styles.categoryCard} ${
                isActive ? styles.categoryCardActive : ""
              }`}
              variants={fadeUp}
              onClick={() => setActiveCategory(item.title)}
            >
              <div className={styles.categoryIcon} aria-hidden="true">
                <Icon size={22} />
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </motion.button>
          );
        })}
        {filteredCategories.length === 0 && (
          <div className={styles.emptyState}>No categories match your search.</div>
        )}
      </motion.div>

      <motion.div className={styles.faqHeader} {...inView} variants={fadeUp}>
        <h2>Top questions</h2>
        <p>Answers to our most frequently asked questions.</p>
      </motion.div>
      <motion.div className={styles.faqList} {...inView} variants={stagger}>
        {filteredFaqs.map((item) => (
          <motion.details key={item.question} className={styles.faqItem} variants={fadeUp}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </motion.details>
        ))}
        {filteredFaqs.length === 0 && (
          <div className={styles.emptyState}>No FAQs match your search.</div>
        )}
      </motion.div>

      <motion.div className={styles.contactBanner} {...inView} variants={fadeUp}>
        <div>
          <h2>Still need help?</h2>
          <p>
            Our team is here to assist you with orders, returns, and account
            questions.
          </p>
        </div>
        <div className={styles.contactActions}>
          <a href="mailto:davedealsbiz@gmail.com" className={styles.contactBtn}>
            <Mail size={16} />
            Email support
          </a>
          <a href="tel:+2348143791465" className={styles.contactBtnOutline}>
            <Phone size={16} />
            Call support
          </a>
        </div>
      </motion.div>
    </section>
  );
}
