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

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    const terms = needle.split(/\s+/).filter(Boolean);
    return allCategories
      .filter((c) => {
        const name = String(c.name || "").toLowerCase();
        return terms.every((term) => name.includes(term));
      })
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .slice(0, 8);
  }, [allCategories, query]);

  const productResults = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    if (!allProducts.length) return [];
    const terms = needle.split(/\s+/).filter(Boolean);
    return allProducts
      .filter((p) => {
        const title = String(p.title || "").toLowerCase();
        return terms.every((term) => title.includes(term));
      })
      .slice(0, 6);
  }, [allProducts, query]);

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
                  {topCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/c/${cat.slug}`}
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
                    {topCategories.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/c/${cat.slug}`}
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
