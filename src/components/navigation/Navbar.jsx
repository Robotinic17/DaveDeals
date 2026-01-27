import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Search, User, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./Navbar.module.css";

import logo from "../../assets/logo.png";
import furnitureImg from "../../assets/categories/furniture.png";
import handbagImg from "../../assets/categories/handbag.png";
import booksImg from "../../assets/categories/books.png";
import techImg from "../../assets/categories/tech.png";
import sneakersImg from "../../assets/categories/sneakers.png";
import travelImg from "../../assets/categories/travel.png";
import { CATEGORY_OVERRIDES, resolveCategorySlug } from "../../lib/categoryResolver";

const CATEGORY_IMAGES = {
  "headphones-and-earbuds": techImg,
  "cell-phones-and-accessories": techImg,
  "travel-accessories": travelImg,
  "home-d-cor-products": furnitureImg,
  "kitchen-and-dining": booksImg,
  "home-storage-and-organization": furnitureImg,
};

export default function Navbar() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [topCategories, setTopCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const normalizedQuery = useMemo(
    () =>
      String(query || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, " ")
        .trim(),
    [query],
  );
  const queryTokens = useMemo(
    () => normalizedQuery.split(/\s+/).filter(Boolean),
    [normalizedQuery],
  );

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch("/data/categories.top.json");
        if (!res.ok) throw new Error("Failed to load categories");
        const data = await res.json();
        if (!active) return;

        const items = Array.isArray(data) ? data : [];
        setTopCategories(
          items.map((item) => ({
            slug: item.slug,
            label: item.name || item.slug,
            image: CATEGORY_IMAGES[item.slug] || furnitureImg,
            count: item.count ?? null,
          }))
        );
      } catch (e) {
        if (!active) return;
        setTopCategories([]);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    function onClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target))
        setSearchOpen(false);
    }

    function onKey(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const res = await fetch("/data/categories.enriched.json");
        if (!res.ok) throw new Error("Failed to load categories");
        const data = await res.json();
        if (!active) return;
        setAllCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!active) return;
        setAllCategories([]);
      }
    }

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      if (!searchOpen || productsLoaded) return;
      if (!query.trim()) return;
      try {
        const res = await fetch("/data/products.json");
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        if (!active) return;
        setAllProducts(Array.isArray(data) ? data : []);
        setProductsLoaded(true);
      } catch (e) {
        if (!active) return;
        setAllProducts([]);
        setProductsLoaded(true);
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, [searchOpen, productsLoaded, query]);

  function isCloseMatch(a, b) {
    if (!a || !b) return false;
    const alen = a.length;
    const blen = b.length;
    if (Math.abs(alen - blen) > 1) return false;
    let i = 0;
    let j = 0;
    let edits = 0;
    while (i < alen && j < blen) {
      if (a[i] === b[j]) {
        i += 1;
        j += 1;
        continue;
      }
      edits += 1;
      if (edits > 1) return false;
      if (alen > blen) i += 1;
      else if (blen > alen) j += 1;
      else {
        i += 1;
        j += 1;
      }
    }
    return edits + (alen - i) + (blen - j) <= 1;
  }

  function normalizeSearchText(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function scoreTextMatch(text, queryText, tokens) {
    if (!text) return 0;
    const normalized = text;
    let score = 0;
    if (queryText && normalized.startsWith(queryText)) score += 100;
    if (queryText && normalized.includes(queryText)) score += 60;
    let tokenHits = 0;
    const words = normalized.split(/\s+/).filter(Boolean);
    for (const token of tokens) {
      if (normalized.includes(token)) {
        tokenHits += 1;
        score += 10;
      } else if (token.length >= 4) {
        const close = words.some((word) => isCloseMatch(token, word));
        if (close) score += 6;
      }
    }
    if (tokens.length && tokenHits === tokens.length) score += 20;
    return score;
  }

  const results = useMemo(() => {
    if (!normalizedQuery) return [];
    const scored = [];
    for (const c of allCategories) {
      const text = normalizeSearchText(`${c.name || ""} ${c.slug || ""}`);
      if (!text) continue;
      if (
        !text.includes(normalizedQuery) &&
        !queryTokens.some((t) => text.includes(t))
      ) {
        const words = text.split(/\s+/).filter(Boolean);
        const typoMatch = queryTokens.some((t) =>
          words.some((w) => isCloseMatch(t, w)),
        );
        if (!typoMatch) continue;
      }
      const baseScore = scoreTextMatch(text, normalizedQuery, queryTokens);
      const countBoost = Math.log10((c.count || 0) + 10);
      scored.push({ item: c, score: baseScore + countBoost });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 8).map((s) => s.item);
  }, [allCategories, normalizedQuery, queryTokens]);

  const resolvedTopCategories = useMemo(
    () =>
      topCategories.map((cat) => ({
        ...cat,
        resolvedSlug:
          resolveCategorySlug(
            { slug: cat.slug, name: cat.label },
            allCategories,
            CATEGORY_OVERRIDES,
          ) || cat.slug,
      })),
    [topCategories, allCategories],
  );

  const productResults = useMemo(() => {
    if (!normalizedQuery || normalizedQuery.length < 2) return [];
    if (!allProducts.length) return [];
    const candidates = [];
    for (const p of allProducts) {
      const title = normalizeSearchText(p.title);
      if (!title) continue;
      if (
        title.includes(normalizedQuery) ||
        queryTokens.some((t) => title.includes(t))
      ) {
        candidates.push(p);
        if (candidates.length >= 800) break;
      }
    }

    const scored = candidates.map((p) => {
      const title = normalizeSearchText(p.title);
      const category = normalizeSearchText(p.category);
      const text = `${title} ${category}`.trim();
      let score = scoreTextMatch(text, normalizedQuery, queryTokens);
      const rating = Number(p.rating || 0);
      if (Number.isFinite(rating)) score += rating;
      return { item: p, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 6).map((s) => s.item);
  }, [allProducts, normalizedQuery, queryTokens]);

  return (
    <header className={styles.navbar}>
      <div className={`${styles.inner} ${searchOpen ? styles.searchActive : ""}`}>
        <Link to="/" className={styles.brand}>
          <img src={logo} alt="DaveDeals" className={styles.logo} />
        </Link>

        <div className={styles.categoryWrap} ref={menuRef}>
          <button
            type="button"
            className={styles.categoryBtn}
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            {t("nav.category")} <ChevronDown size={16} />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                className={styles.categoryMenu}
                role="menu"
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <div className={styles.categoryHeader}>Top Categories</div>
                <div className={styles.categoryGrid}>
                  {resolvedTopCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/c/${cat.resolvedSlug}`}
                      className={styles.categoryItem}
                      onClick={() => setMenuOpen(false)}
                    >
                      <img
                        src={cat.image}
                        alt=""
                        className={styles.categoryImg}
                      />
                      <span>{cat.label}</span>
                    </Link>
                  ))}
                </div>
                <div className={styles.categoryFooter}>
                  <Link to="/categories" onClick={() => setMenuOpen(false)}>
                    View all categories
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className={styles.links}>
          <Link to="/deals" className={styles.link}>
            {t("nav.deals")}
          </Link>
          <Link to="/whats-new" className={styles.link}>
            {t("nav.whatsNew")}
          </Link>
          <Link to="/delivery" className={styles.link}>
            {t("nav.delivery")}
          </Link>
        </nav>

        <div className={styles.searchWrap} ref={searchRef}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder={t("nav.searchPlaceholder")}
            value={query}
            onFocus={() => setSearchOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(true);
            }}
          />
          <button
            type="button"
            className={styles.searchBtn}
            aria-label={t("nav.search")}
          >
            <Search size={18} />
          </button>
          <AnimatePresence>
            {searchOpen && (
            <motion.div
              className={styles.searchPanel}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {!query && (
                <>
                  <div className={styles.searchHeader}>Popular Categories</div>
                  <div className={styles.searchGrid}>
                    {resolvedTopCategories.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/c/${cat.resolvedSlug}`}
                        className={styles.searchCard}
                        onClick={() => setSearchOpen(false)}
                      >
                        <img
                          src={cat.image}
                          alt=""
                          className={styles.searchImage}
                        />
                        <div>
                          <p className={styles.searchTitle}>{cat.label}</p>
                          {cat.count != null && (
                            <p className={styles.searchMeta}>
                              {cat.count} available
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
              {query && (
                <>
                  <div className={styles.searchHeader}>Categories</div>
                  <div className={styles.searchList}>
                    {results.length === 0 && (
                      <div className={styles.searchEmpty}>
                        No categories match "{query}"
                      </div>
                    )}
                    {results.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/c/${cat.slug}`}
                        className={styles.searchRow}
                        onClick={() => setSearchOpen(false)}
                      >
                        <span className={styles.searchInitial}>
                          {cat.name?.slice(0, 1) || "?"}
                        </span>
                        <span className={styles.searchRowTitle}>
                          {cat.name}
                        </span>
                        <span className={styles.searchRowMeta}>
                          {cat.count} available
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className={styles.searchDivider} />
                  <div className={styles.searchHeader}>Products</div>
                  <div className={styles.searchList}>
                    {productResults.length === 0 && (
                      <div className={styles.searchEmpty}>
                        No products match "{query}"
                      </div>
                    )}
                    {productResults.map((p) => (
                      <Link
                        key={p.id || p.asin}
                        to={`/p/${p.id || p.asin}`}
                        className={styles.searchRow}
                        onClick={() => setSearchOpen(false)}
                      >
                        <img
                          src={(p.thumbnail || p.imgUrl || "").replace(
                            /^http:\/\//,
                            "https://"
                          )}
                          alt=""
                          className={styles.searchThumb}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/fallback-product.png";
                          }}
                        />
                        <span className={styles.searchRowTitle}>
                          {p.title}
                        </span>
                        <span className={styles.searchRowMeta}>
                          {p.category || "Product"}
                        </span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={styles.actions}>
          <Link to="/account" className={styles.actionLink}>
            <User size={18} />
            <span>{t("nav.account")}</span>
          </Link>

          <Link to="/cart" className={styles.actionLink}>
            <ShoppingCart size={18} />
            <span>{t("nav.cart")}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
