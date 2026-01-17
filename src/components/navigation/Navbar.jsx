import { Link } from "react-router-dom";
import { ChevronDown, Search, User, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./Navbar.module.css";

import logo from "../../assets/logo.png";

export default function Navbar() {
  const { t } = useTranslation();

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <img src={logo} alt="DaveDeals" className={styles.logo} />
        </Link>

        <button type="button" className={styles.categoryBtn}>
          {t("nav.category")} <ChevronDown size={16} />
        </button>

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

        <div className={styles.searchWrap}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder={t("nav.searchPlaceholder")}
          />
          <button
            type="button"
            className={styles.searchBtn}
            aria-label={t("nav.search")}
          >
            <Search size={18} />
          </button>
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
