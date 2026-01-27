import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import logo from "../../assets/logo.png";
import stripeLogo from "../../assets/stripe.png";
import visaLogo from "../../assets/visa.png";
import mastercardLogo from "../../assets/Mastercard.png";
import amazonLogo from "../../assets/Amazon.png";
import klarnaLogo from "../../assets/Klarna.png";
import paypalLogo from "../../assets/PayPal.png";
import applePayLogo from "../../assets/ApplePay.png";
import googlePayLogo from "../../assets/GooglePay.png";
import { getAllCategories } from "../../lib/catalog";
import { CATEGORY_OVERRIDES, resolveCategorySlug } from "../../lib/categoryResolver";

const paymentBadges = [
  { id: "stripe", src: stripeLogo, alt: "Stripe" },
  { id: "visa", src: visaLogo, alt: "Visa" },
  { id: "mastercard", src: mastercardLogo, alt: "Mastercard" },
  { id: "amazon", src: amazonLogo, alt: "Amazon Pay" },
  { id: "klarna", src: klarnaLogo, alt: "Klarna" },
  { id: "paypal", src: paypalLogo, alt: "PayPal" },
  { id: "applepay", src: applePayLogo, alt: "Apple Pay" },
  { id: "googlepay", src: googlePayLogo, alt: "Google Pay" },
];

const columns = [
  {
    title: "Department",
    links: [
      { label: "Fashion", type: "category" },
      { label: "Education Product", type: "category" },
      { label: "Frozen Food", type: "category" },
      { label: "Beverages", type: "category" },
      { label: "Organic Grocery", type: "category" },
      { label: "Office Supplies", type: "category" },
      { label: "Beauty Products", type: "category" },
      { label: "Books", type: "category" },
      { label: "Electronics & Gadget", type: "category" },
      { label: "Travel Accessories", type: "category" },
      { label: "Fitness", type: "category" },
      { label: "Sneakers", type: "category" },
      { label: "Toys", type: "category" },
      { label: "Furniture", type: "category" },
    ],
  },
  {
    title: "About Us",
    links: [
      { label: "About DaveDeals", to: "/" },
      { label: "Careers", to: "/" },
      { label: "News & Blog", to: "/whats-new" },
      { label: "Help", to: "/categories" },
      { label: "Press Center", to: "/" },
      { label: "Shop by Location", to: "/categories" },
      { label: "Brands", to: "/categories" },
      { label: "Affiliate & Partners", to: "/" },
      { label: "Ideas & Guides", to: "/whats-new" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Gift Cards", to: "/" },
      { label: "Mobile App", to: "/" },
      { label: "Shipping & Delivery", to: "/deals/delivery" },
      { label: "Order Pickup", to: "/" },
      { label: "Account Signup", to: "/" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Help Center", to: "/categories" },
      { label: "Returns", to: "/" },
      { label: "Track Orders", to: "/" },
      { label: "Contact Us", to: "/" },
      { label: "Feedback", to: "/" },
      { label: "Security & Fraud", to: "/" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const items = await getAllCategories();
        if (!active) return;
        setCategories(Array.isArray(items) ? items : []);
      } catch (e) {
        if (!active) return;
        setCategories([]);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const categoryOverrides = useMemo(
    () => ({
      ...CATEGORY_OVERRIDES,
    }),
    [],
  );

  const resolvedColumns = useMemo(
    () =>
      columns.map((col) => ({
        ...col,
        links: col.links.map((link) => {
          if (link.type !== "category") return link;
          const slug = resolveCategorySlug(
            { name: link.label },
            categories,
            categoryOverrides,
          );
          return {
            ...link,
            to: slug ? `/c/${slug}` : "/categories",
          };
        }),
      })),
    [categories, categoryOverrides],
  );

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <Link to="/" className={styles.brandLink} aria-label="DaveDeals home">
            <img src={logo} alt="DaveDeals" className={styles.logo} />
          </Link>
          <p className={styles.tagline}>
            Where brands showcase their best, and buyers explore with ease.
            Shopping designed to feel effortless and refined.
          </p>

          <div className={styles.payments}>
            <p className={styles.paymentsTitle}>Accepted Payments</p>
            <div className={styles.paymentGrid}>
              {paymentBadges.map((badge) => (
                <div key={badge.id} className={styles.paymentBadge}>
                  <img src={badge.src} alt={badge.alt} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {resolvedColumns.map((col) => (
          <div key={col.title} className={styles.col}>
            <p className={styles.colTitle}>{col.title}</p>
            <div className={styles.colLinks}>
              {col.links.map((link) => (
                <Link key={link.label} className={styles.link} to={link.to}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomRow}>
          <Link className={styles.bottomItem} to="/">
            Become Seller
          </Link>
          <Link className={styles.bottomItem} to="/">
            Gift Cards
          </Link>
          <Link className={styles.bottomItem} to="/categories">
            Help Center
          </Link>
        </div>
        <div className={styles.bottomLinks}>
          <Link className={styles.bottomItem} to="/">
            Terms of Service
          </Link>
          <Link className={styles.bottomItem} to="/">
            Privacy & Policy
          </Link>
          <span className={styles.copy}>© {year} DaveDeals</span>
        </div>
      </div>
    </footer>
  );
}
