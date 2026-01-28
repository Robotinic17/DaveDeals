import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart, SlidersHorizontal, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import styles from "./Category.module.css";

import PromoSlider from "../components/category/PromoSlider";
import RatingStars from "../components/category/RatingStars";
import { getCategoryBySlug, getProductsByCategorySlug } from "../lib/catalog";
import { getProductImage } from "../lib/productImages";

function formatCategoryTitle(slug) {
  if (!slug) return "";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function clampRating(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(5, n));
}

function getTypeKey(title = "") {
  const text = String(title).trim();
  if (!text) return "";
  const primary = text.split(/[-,(]/)[0].trim();
  const words = primary.split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  const first = words[0].toLowerCase();
  const second = words[1]?.toLowerCase();
  if (STOP_WORDS.has(first) && second) return second;
  return first;
}

const PAGE_SIZE = 70;
const MAX_PAGES = 5;
const MIN_LOADING_MS = 900;
const SORT_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "price_asc", label: "Price: Low to High" },
  { id: "price_desc", label: "Price: High to Low" },
  { id: "rating_desc", label: "Top Rated" },
  { id: "reviews_desc", label: "Most Reviewed" },
  { id: "title_asc", label: "Name: A to Z" },
];

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "set",
  "pack",
  "for",
  "with",
  "and",
  "of",
  "in",
  "to",
]);

const COLOR_OPTIONS = [
  { id: "black", label: "Black" },
  { id: "white", label: "White" },
  { id: "gray", label: "Gray" },
  { id: "blue", label: "Blue" },
  { id: "red", label: "Red" },
  { id: "green", label: "Green" },
  { id: "yellow", label: "Yellow" },
  { id: "pink", label: "Pink" },
  { id: "purple", label: "Purple" },
  { id: "orange", label: "Orange" },
  { id: "brown", label: "Brown" },
  { id: "gold", label: "Gold" },
  { id: "silver", label: "Silver" },
];

export default function Category() {
  const { slug } = useParams();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [materialOpen, setMaterialOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minRating: "",
    minReviews: "",
    onlyPriced: false,
    onlyReviewed: false,
    typeKey: "",
    priceBand: "",
    materialQuality: "",
    color: "",
  });

  const [likedIds, setLikedIds] = useState(() => new Set());
  const [cartIds, setCartIds] = useState(() => new Set());

  const title = useMemo(
    () => categoryName || formatCategoryTitle(slug),
    [categoryName, slug]
  );

  function toggleLiked(id) {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleCart(id) {
    setCartIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  useEffect(() => {
    let isActive = true;

    async function load() {
      if (!slug) return;

      setCurrentPage(1);
      setLoading(true);
      setError(false);
      setCategoryName("");
      setTypeOpen(false);
      setPriceOpen(false);
      setReviewOpen(false);
      setMaterialOpen(false);
      setColorOpen(false);
      setFilters({
        minPrice: "",
        maxPrice: "",
        minRating: "",
        minReviews: "",
        onlyPriced: false,
        onlyReviewed: false,
        typeKey: "",
        priceBand: "",
        materialQuality: "",
        color: "",
      });

      const start = Date.now();
      try {
        const [items, category] = await Promise.all([
          getProductsByCategorySlug(slug),
          getCategoryBySlug(slug),
        ]);
        if (!isActive) return;

        setProducts(Array.isArray(items) ? items : []);
        if (category?.name) setCategoryName(category.name);
      } catch (e) {
        if (!isActive) return;
        setError(true);
      } finally {
        if (!isActive) return;
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
        if (remaining === 0) {
          setLoading(false);
        } else {
          setTimeout(() => {
            if (!isActive) return;
            setLoading(false);
          }, remaining);
        }
      }
    }

    load();

    return () => {
      isActive = false;
    };
  }, [slug]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortKey, filters, slug]);

  useEffect(() => {
    if (filters.priceBand) setSortKey("featured");
  }, [filters.priceBand]);

  const typeOptions = useMemo(() => {
    const counts = new Map();
    for (const p of products) {
      const key = getTypeKey(p.title);
      if (!key) continue;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([key, count]) => ({
        key,
        label: formatCategoryTitle(key),
        count,
      }));
  }, [products]);

  const priceBands = useMemo(() => {
    const values = products
      .map((p) => Number(p.price))
      .filter((v) => Number.isFinite(v))
      .sort((a, b) => a - b);
    if (!values.length) return null;
    const lowIdx = Math.floor(values.length * 0.33);
    const midIdx = Math.floor(values.length * 0.66);
    return {
      budgetMax: values[lowIdx],
      midMax: values[midIdx],
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const minPrice =
      filters.minPrice === "" ? null : Number(filters.minPrice);
    const maxPrice =
      filters.maxPrice === "" ? null : Number(filters.maxPrice);
    const minRating =
      filters.minRating === "" ? null : Number(filters.minRating);
    const minReviews =
      filters.minReviews === "" ? null : Number(filters.minReviews);

    return products.filter((p) => {
      const price = Number(p.price);
      const rating = clampRating(p.rating);
      const reviews = Number(p.reviewsCount);

      if (filters.onlyPriced && !Number.isFinite(price)) return false;
      if (filters.onlyReviewed && !Number.isFinite(reviews)) return false;

      const hasPriceFilter =
        Number.isFinite(minPrice) || Number.isFinite(maxPrice);
      if (hasPriceFilter && !Number.isFinite(price)) return false;
      if (Number.isFinite(minPrice) && price < minPrice) return false;
      if (Number.isFinite(maxPrice) && price > maxPrice) return false;
      if (Number.isFinite(minRating) && rating < minRating) return false;
      if (Number.isFinite(minReviews) && !Number.isFinite(reviews)) return false;
      if (Number.isFinite(minReviews) && reviews < minReviews) return false;

      if (filters.typeKey) {
        const typeKey = getTypeKey(p.title);
        if (typeKey !== filters.typeKey) return false;
      }

      if (filters.priceBand && priceBands) {
        if (!Number.isFinite(price)) return false;
        if (filters.priceBand === "budget" && price > priceBands.budgetMax)
          return false;
        if (
          filters.priceBand === "mid" &&
          (price <= priceBands.budgetMax || price > priceBands.midMax)
        )
          return false;
      }

      if (filters.materialQuality) {
        const isQuality = rating >= 4;
        if (filters.materialQuality === "quality" && !isQuality) return false;
        if (filters.materialQuality === "less" && isQuality) return false;
      }

      if (filters.color) {
        const text = String(p.title || "").toLowerCase();
        if (filters.color === "gray") {
          if (!text.includes("gray") && !text.includes("grey")) return false;
        } else if (!text.includes(filters.color)) {
          return false;
        }
      }

      return true;
    });
  }, [products, filters, priceBands]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortKey) {
      case "price_asc":
        list.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price_desc":
        list.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "rating_desc":
        list.sort((a, b) => clampRating(b.rating) - clampRating(a.rating));
        break;
      case "reviews_desc":
        list.sort((a, b) => Number(b.reviewsCount) - Number(a.reviewsCount));
        break;
      case "title_asc":
        list.sort((a, b) => String(a.title).localeCompare(String(b.title)));
        break;
      default:
        break;
    }
    return list;
  }, [filteredProducts, sortKey]);

  const maxItems = PAGE_SIZE * MAX_PAGES;
  const pagedProducts = useMemo(
    () => sortedProducts.slice(0, maxItems),
    [sortedProducts, maxItems]
  );

  const totalPages = useMemo(() => {
    const pages = Math.ceil(pagedProducts.length / PAGE_SIZE);
    return Math.max(1, pages);
  }, [pagedProducts.length]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const shownProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return pagedProducts.slice(start, start + PAGE_SIZE);
  }, [pagedProducts, currentPage]);

  const pageItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const items = [1];
    const left = Math.max(2, currentPage - 1);
    const right = Math.min(totalPages - 1, currentPage + 1);
    if (left > 2) items.push("gap-left");
    for (let i = left; i <= right; i += 1) items.push(i);
    if (right < totalPages - 1) items.push("gap-right");
    items.push(totalPages);
    return items;
  }, [currentPage, totalPages]);

  return (
    <section className={styles.page}>
      <PromoSlider />

      <div className={styles.inner}>
        <div className={styles.filterRow}>
          <div className={styles.chips}>
            <div className={styles.chipWrap}>
              <button
                type="button"
                className={styles.chip}
                onClick={() => setTypeOpen((v) => !v)}
              >
                <span>{t("category.chipType", { title })}</span>
                <ChevronDown size={14} />
              </button>
              {typeOpen && (
                <div className={styles.chipMenu} role="menu">
                <button
                  type="button"
                  className={`${styles.chipMenuItem} ${
                    !filters.typeKey ? styles.chipMenuItemActive : ""
                  }`}
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, typeKey: "" }));
                    setTypeOpen(false);
                  }}
                  role="menuitem"
                >
                  All types
                </button>
                {typeOptions.length > 0 ? (
                  typeOptions.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      className={`${styles.chipMenuItem} ${
                        filters.typeKey === option.key
                          ? styles.chipMenuItemActive
                          : ""
                      }`}
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          typeKey: option.key,
                        }));
                        setTypeOpen(false);
                      }}
                      role="menuitem"
                    >
                      {option.label} ({option.count})
                    </button>
                  ))
                ) : (
                  <button
                    type="button"
                    className={styles.chipMenuItem}
                    role="menuitem"
                    disabled
                  >
                    No types found
                  </button>
                )}
                </div>
              )}
            </div>
            <div className={styles.chipWrap}>
              <button
                type="button"
                className={`${styles.chip} ${
                  filters.onlyPriced ? styles.chipActive : ""
                }`}
                onClick={() => setPriceOpen((v) => !v)}
                aria-pressed={filters.onlyPriced}
              >
                <span>{t("category.price")}</span>
                <ChevronDown size={14} />
              </button>
              {priceOpen && (
                <div className={styles.chipMenu} role="menu">
                <button
                  type="button"
                  className={`${styles.chipMenuItem} ${
                    sortKey === "price_asc" ? styles.chipMenuItemActive : ""
                  }`}
                  onClick={() => {
                    setSortKey("price_asc");
                    setFilters((prev) => ({
                      ...prev,
                      priceBand: "",
                      onlyPriced: false,
                    }));
                    setPriceOpen(false);
                  }}
                  role="menuitem"
                >
                  Low to High
                </button>
                <button
                  type="button"
                  className={`${styles.chipMenuItem} ${
                    sortKey === "price_desc" ? styles.chipMenuItemActive : ""
                  }`}
                  onClick={() => {
                    setSortKey("price_desc");
                    setFilters((prev) => ({
                      ...prev,
                      priceBand: "",
                      onlyPriced: false,
                    }));
                    setPriceOpen(false);
                  }}
                  role="menuitem"
                >
                  High to Low
                </button>
                <button
                  type="button"
                  className={`${styles.chipMenuItem} ${
                    filters.priceBand === "budget"
                      ? styles.chipMenuItemActive
                      : ""
                  }`}
                  onClick={() => {
                    if (!priceBands) return;
                    setFilters((prev) => ({
                      ...prev,
                      priceBand: "budget",
                      onlyPriced: true,
                    }));
                    setPriceOpen(false);
                  }}
                  role="menuitem"
                  disabled={!priceBands}
                >
                  Budget
                </button>
                <button
                  type="button"
                  className={`${styles.chipMenuItem} ${
                    filters.priceBand === "mid"
                      ? styles.chipMenuItemActive
                      : ""
                  }`}
                  onClick={() => {
                    if (!priceBands) return;
                    setFilters((prev) => ({
                      ...prev,
                      priceBand: "mid",
                      onlyPriced: true,
                    }));
                    setPriceOpen(false);
                  }}
                  role="menuitem"
                  disabled={!priceBands}
                >
                  Mid range
                </button>
                </div>
              )}
            </div>
            <div className={styles.chipWrap}>
              <button
                type="button"
                className={`${styles.chip} ${
                  filters.onlyReviewed ? styles.chipActive : ""
                }`}
                onClick={() => setReviewOpen((v) => !v)}
                aria-pressed={filters.onlyReviewed}
              >
                <span>{t("category.review")}</span>
                <ChevronDown size={14} />
              </button>
              {reviewOpen && (
                <div className={styles.chipMenu} role="menu">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`${styles.chipMenuItem} ${
                      Number(filters.minRating || 0) === value
                        ? styles.chipMenuItemActive
                        : ""
                    }`}
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        minRating: value ? String(value) : "",
                        onlyReviewed: value > 0,
                      }));
                      setReviewOpen(false);
                    }}
                    role="menuitem"
                  >
                    {value === 0 ? "Any rating" : `${value} star`}
                  </button>
                ))}
                </div>
              )}
            </div>
            <div className={styles.chipWrap}>
              <button
                type="button"
                className={styles.chip}
                onClick={() => setColorOpen((v) => !v)}
              >
                <span>{t("category.color")}</span>
                <ChevronDown size={14} />
              </button>
              {colorOpen && (
                <div className={styles.chipMenu} role="menu">
                  <button
                    type="button"
                    className={`${styles.chipMenuItem} ${
                      !filters.color ? styles.chipMenuItemActive : ""
                    }`}
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, color: "" }));
                      setColorOpen(false);
                    }}
                    role="menuitem"
                  >
                    Any color
                  </button>
                  {COLOR_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`${styles.chipMenuItem} ${
                        filters.color === option.id
                          ? styles.chipMenuItemActive
                          : ""
                      }`}
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          color: option.id,
                        }));
                        setColorOpen(false);
                      }}
                      role="menuitem"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.chipWrap}>
              <button
                type="button"
                className={styles.chip}
                onClick={() => setMaterialOpen((v) => !v)}
              >
                <span>{t("category.material")}</span>
                <ChevronDown size={14} />
              </button>
              {materialOpen && (
                <div className={styles.chipMenu} role="menu">
                <button
                  type="button"
                  className={`${styles.chipMenuItem} ${
                    !filters.materialQuality ? styles.chipMenuItemActive : ""
                  }`}
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      materialQuality: "",
                    }));
                    setMaterialOpen(false);
                  }}
                  role="menuitem"
                >
                  Any quality
                </button>
                <button
                  type="button"
                  className={`${styles.chipMenuItem} ${
                    filters.materialQuality === "quality"
                      ? styles.chipMenuItemActive
                      : ""
                  }`}
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      materialQuality: "quality",
                    }));
                    setMaterialOpen(false);
                  }}
                  role="menuitem"
                >
                  Quality
                </button>
                <button
                  type="button"
                  className={`${styles.chipMenuItem} ${
                    filters.materialQuality === "less"
                      ? styles.chipMenuItemActive
                      : ""
                  }`}
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      materialQuality: "less",
                    }));
                    setMaterialOpen(false);
                  }}
                  role="menuitem"
                >
                  Less quality
                </button>
                </div>
              )}
            </div>

            <button
              type="button"
              className={styles.chipWide}
              onClick={() => setFiltersOpen((v) => !v)}
            >
              <span>{t("category.allFilters")}</span>
              <SlidersHorizontal size={14} />
            </button>
          </div>

          <div className={styles.sortWrap}>
            <button
              type="button"
              className={styles.sortBtn}
              onClick={() => setSortOpen((v) => !v)}
            >
              <span>{t("category.sortBy")}</span>
              <ChevronDown size={14} />
            </button>
            {sortOpen && (
              <div className={styles.sortMenu} role="menu">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`${styles.sortItem} ${
                      sortKey === option.id ? styles.sortItemActive : ""
                    }`}
                    onClick={() => {
                      setSortKey(option.id);
                      setFilters((prev) => ({ ...prev, priceBand: "" }));
                      setSortOpen(false);
                    }}
                    role="menuitem"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {filtersOpen && (
          <div className={styles.filtersPanel}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel} htmlFor="min-price">
                Min price
              </label>
              <input
                id="min-price"
                type="number"
                className={styles.filterInput}
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
                }
              />
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel} htmlFor="max-price">
                Max price
              </label>
              <input
                id="max-price"
                type="number"
                className={styles.filterInput}
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
                }
              />
            </div>
            <div className={styles.filterActions}>
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() =>
                  setFilters({
                    minPrice: "",
                    maxPrice: "",
                    minRating: "",
                    minReviews: "",
                    onlyPriced: false,
                    onlyReviewed: false,
                    typeKey: "",
                    priceBand: "",
                    materialQuality: "",
                    color: "",
                  })
                }
              >
                Clear
              </button>
              <button
                type="button"
                className={styles.applyBtn}
                onClick={() => setFiltersOpen(false)}
              >
                Apply
              </button>
            </div>
            {priceBands && (
              <p className={styles.filterHint}>
                Budget &lt;= $ {priceBands.budgetMax} | Mid range &lt;= $ {priceBands.midMax}
              </p>
            )}
          </div>
        )}

        <h1 className={styles.title}>{t("category.title", { title })}</h1>

        {loading && (
          <div className={styles.skeletonGrid} aria-label="Loading">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className={styles.skeletonCard}>
                <div className={styles.skeletonMedia} />
                <div className={styles.skeletonBody}>
                  <div className={styles.skeletonRow}>
                    <span className={styles.skeletonLine} />
                    <span className={styles.skeletonLineShort} />
                  </div>
                  <span className={styles.skeletonLine} />
                  <span className={styles.skeletonLine} />
                  <span className={styles.skeletonLineShort} />
                  <span className={styles.skeletonButton} />
                </div>
              </div>
            ))}
          </div>
        )}
        {error && <p className={styles.error}>{t("category.loadError")}</p>}

        {!loading && !error && sortedProducts.length === 0 && (
          <div className={styles.emptyState}>
            <h2>No results found</h2>
            <p>
              Try a different search or clear your filters. If this keeps
              happening, check your connection.
            </p>
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() =>
                setFilters({
                  minPrice: "",
                  maxPrice: "",
                  minRating: "",
                  minReviews: "",
                  onlyPriced: false,
                  onlyReviewed: false,
                  typeKey: "",
                  priceBand: "",
                  materialQuality: "",
                  color: "",
                })
              }
            >
              Clear filters
            </button>
          </div>
        )}

        {!loading && !error && sortedProducts.length > 0 && (
          <>
            <div className={styles.grid}>
              {shownProducts.map((p, idx) => {
                const id = p.id || p.asin;
                if (!id) return null;

                const rating = clampRating(p.rating);
                const price =
                  typeof p.price === "number" ? p.price : Number(p.price);

                const imgSrc = getProductImage(p);

                return (
                  <motion.article
                    key={id}
                    className={styles.card}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{
                      duration: 0.35,
                      ease: "easeOut",
                      delay: Math.min(idx * 0.03, 0.25),
                    }}
                  >
                    <Link to={`/p/${id}`} className={styles.cardLink}>
                    <motion.button
                      type="button"
                      className={`${styles.heartBtn} ${
                        likedIds.has(id) ? styles.hearted : ""
                      }`}
                      aria-label={t("category.addWishlist")}
                      onClick={() => toggleLiked(id)}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart size={18} />
                      <span className={styles.heartShine} aria-hidden="true" />
                    </motion.button>

                    <div className={styles.media}>
                      <img
                        src={imgSrc || "/fallback-product.png"}
                        alt={p.title || "Product"}
                        className={styles.thumb}
                        loading="lazy"
                        referrerPolicy="origin"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/fallback-product.png";
                        }}
                      />
                    </div>

                    <div className={styles.cardBody}>
                      <div className={styles.row}>
                        <p className={`${styles.name} ${styles.clamp2}`}>
                          {p.title}
                        </p>
                        <p className={styles.price}>
                          {Number.isFinite(price) ? `$${price}` : "$?"}
                        </p>
                      </div>

                      <p className={`${styles.desc} ${styles.clamp2}`}>
                        {/* dataset does not have description, so show category + reviews */}
                        {p.category || title}
                        {p.reviewsCount != null ? ` (${p.reviewsCount})` : ""}
                      </p>

                      <div className={styles.ratingRow}>
                        <RatingStars value={rating} />
                        <span className={styles.ratingText}>
                          ({rating.toFixed(1)})
                        </span>
                      </div>

                      <motion.button
                        type="button"
                        className={`${styles.addBtn} ${
                          cartIds.has(id) ? styles.added : ""
                        }`}
                        onClick={() => toggleCart(id)}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className={styles.addBtnText}>
                          {cartIds.has(id)
                            ? t("category.added")
                            : t("category.addToCart")}
                        </span>
                        <span className={styles.addShine} aria-hidden="true" />
                      </motion.button>
                    </div>
                    </Link>
                  </motion.article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  type="button"
                  className={styles.pageBtn}
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  {"<<"}
                </button>
                <button
                  type="button"
                  className={styles.pageBtn}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  {"<"}
                </button>
                {pageItems.map((item) =>
                  typeof item === "number" ? (
                    <button
                      key={item}
                      type="button"
                      className={`${styles.pageBtn} ${
                        item === currentPage ? styles.pageActive : ""
                      }`}
                      onClick={() => setCurrentPage(item)}
                    >
                      {item}
                    </button>
                  ) : (
                    <span key={item} className={styles.pageGap}>
                      ...
                    </span>
                  )
                )}
                <button
                  type="button"
                  className={styles.pageBtn}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  {">"}
                </button>
                <button
                  type="button"
                  className={styles.pageBtn}
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  {">>"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
