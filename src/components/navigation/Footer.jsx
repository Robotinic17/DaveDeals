import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
    key: "department",
    links: [],
  },
  {
    key: "about",
    links: [
      { key: "aboutDaveDeals", to: "/about" },
      { key: "careers", to: "/careers" },
      { key: "news", to: "/news" },
      { key: "help", to: "/help" },
      { key: "press", to: "/press" },
      { key: "locations", to: "/locations" },
      { key: "brands", to: "/brands" },
      { key: "partners", to: "/partners" },
      { key: "guides", to: "/guides" },
    ],
  },
  {
    key: "services",
    links: [
      { key: "giftCards", to: "/" },
      { key: "mobileApp", to: "/" },
      { key: "shipping", to: "/deals/delivery" },
      { key: "orderPickup", to: "/" },
      { key: "accountSignup", to: "/" },
    ],
  },
  {
    key: "help",
    links: [
      { key: "helpCenter", to: "/categories" },
      { key: "returns", to: "/" },
      { key: "trackOrders", to: "/" },
      { key: "contactUs", to: "/" },
      { key: "feedback", to: "/" },
      { key: "security", to: "/" },
    ],
  },
];

export default function Footer() {
  const { t } = useTranslation();
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

  const categoryOverrides = useMemo(() => ({ ...CATEGORY_OVERRIDES }), []);

  const shortLabelOverrides = useMemo(
    () => ({
      "beading and jewelry making": "Jewelry",
      "knitting and crochet supplies": "Crochet",
      "beauty and personal care": "Beauty",
      "men s clothing": "Men",
      "women s clothing": "Women",
      "toys and games": "Toys",
      "home decor products": "Decor",
      "home d cor products": "Decor",
      "kitchen and dining": "Kitchen",
      "sports and fitness": "Fitness",
      "health and household": "Health",
      "office electronics": "Office",
      "office supplies": "Office",
      "travel accessories": "Travel",
    }),
    [],
  );

  function shortLabel(name) {
    const normalized = String(name || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
    if (!normalized) return "Shop";
    if (shortLabelOverrides[normalized]) return shortLabelOverrides[normalized];
    const first = normalized.split(/\s+/)[0];
    return first ? first[0].toUpperCase() + first.slice(1) : "Shop";
  }

  const departmentLinks = useMemo(() => {
    const sorted = [...categories].sort(
      (a, b) => (b.count || 0) - (a.count || 0),
    );
    return sorted.slice(0, 12).map((cat) => ({
      label: shortLabel(cat.name || cat.slug),
      to: `/c/${cat.slug}`,
    }));
  }, [categories, shortLabelOverrides]);

  const resolvedColumns = useMemo(
    () =>
      columns.map((col) => ({
        ...col,
        links:
          col.key === "department"
            ? departmentLinks
            : col.links.map((link) => {
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
    [categories, categoryOverrides, departmentLinks],
  );

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <Link
            to="/"
            className={styles.brandLink}
            aria-label={t("footer.brandAria")}
          >
            <img src={logo} alt={t("footer.logoAlt")} className={styles.logo} />
          </Link>
          <p className={styles.tagline}>{t("footer.tagline")}</p>

          <div className={styles.payments}>
            <p className={styles.paymentsTitle}>{t("footer.paymentsTitle")}</p>
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
          <div key={col.key} className={styles.col}>
            <p className={styles.colTitle}>{t(`footer.columns.${col.key}`)}</p>
            <div className={styles.colLinks}>
              {col.links.map((link, idx) => (
                <Link
                  key={`${link.key || link.label}-${link.to}-${idx}`}
                  className={styles.link}
                  to={link.to}
                >
                  {link.key ? t(`footer.links.${link.key}`) : link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomRow}>
          <Link className={styles.bottomItem} to="/">
            {t("footer.bottom.becomeSeller")}
          </Link>
          <Link className={styles.bottomItem} to="/">
            {t("footer.bottom.giftCards")}
          </Link>
          <Link className={styles.bottomItem} to="/help">
            {t("footer.bottom.helpCenter")}
          </Link>
        </div>
        <div className={styles.bottomLinks}>
          <Link className={styles.bottomItem} to="/">
            {t("footer.bottom.terms")}
          </Link>
          <Link className={styles.bottomItem} to="/">
            {t("footer.bottom.privacy")}
          </Link>
          <span className={styles.copy}>
            (c) {year} {t("footer.brandName")}
          </span>
        </div>
      </div>
    </footer>
  );
}
