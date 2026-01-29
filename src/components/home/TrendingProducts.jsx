import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./TrendingProducts.module.css";
import { useUnsplashImage } from "../../hooks/useUnsplashImage";
import { getAllCategories } from "../../lib/catalog";

function getWeekKey(date = new Date()) {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function createSeededRandom(seed) {
  let state = seed >>> 0;
  return function random() {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function pickWeeklyItems(list, count, key) {
  if (!Array.isArray(list) || list.length === 0) return [];
  const rand = createSeededRandom(hashString(`trending:${key}`));
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

function normalizeCategory(category, t) {
  if (!category?.slug) return null;
  const count = Number(category.count || 0);
  return {
    id: category.id || category.slug,
    title: category.name || t("home.trending.fallbackTitle"),
    slug: category.slug,
    meta:
      count > 0
        ? t("home.trending.items", { count })
        : t("home.trending.shopThisWeek"),
    query: `${category.name || category.slug} products`,
  };
}

function TrendingCard({ card, t }) {
  const cacheKey = `trending-${String(card.slug || card.id).toLowerCase()}`;
  const { image } = useUnsplashImage(card.query, cacheKey);

  return (
    <article className={styles.card}>
      <Link to={`/c/${card.slug}`} className={styles.cardLink}>
        <div className={styles.media}>
          {image?.url ? (
            <img src={image.url} alt={card.title} loading="lazy" />
          ) : (
            <div className={styles.mediaFallback} />
          )}
        </div>
        <div className={styles.body}>
          <h3 className={styles.cardTitle}>{card.title}</h3>
          <p className={styles.meta}>{card.meta}</p>
          <button type="button" className={styles.cta}>
            {t("common.shopNow")}
          </button>
        </div>
      </Link>

      {image && (
        <p className={styles.credit}>
          {t("common.photoBy")} {" "}
          <a href={image.userLink} target="_blank" rel="noreferrer">
            {image.name}
          </a>{" "}
          {t("common.on")} {" "}
          <a href={image.unsplashLink} target="_blank" rel="noreferrer">
            {t("common.unsplash")}
          </a>
        </p>
      )}
    </article>
  );
}

export default function TrendingProducts() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      try {
        const items = await getAllCategories();
        if (!active) return;
        setCategories(Array.isArray(items) ? items : []);
      } catch (e) {
        if (!active) return;
        setCategories([]);
      } finally {
        if (!active) return;
        setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const cards = useMemo(() => {
    const MAX_CARDS = 2;
    const weekKey = getWeekKey();
    const normalized = categories.map((c) => normalizeCategory(c, t)).filter(Boolean);
    return pickWeeklyItems(normalized, MAX_CARDS, weekKey);
  }, [categories, t]);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>{t("home.trending.title")}</h2>

        <div className={styles.grid}>
          {!loading &&
            cards.map((card) => (
              <TrendingCard key={card.id} card={card} t={t} />
            ))}
        </div>
      </div>
    </section>
  );
}
