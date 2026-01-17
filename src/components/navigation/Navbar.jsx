import { Link } from "react-router-dom";
import { ChevronDown, Search, User, ShoppingCart } from "lucide-react";
import styles from "./Navbar.module.css";

import logo from "../../assets/logo.png";

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <img src={logo} alt="DaveDeals" className={styles.logo} />
        </Link>

        <button type="button" className={styles.categoryBtn}>
          Category <ChevronDown size={16} />
        </button>

        <nav className={styles.links}>
          <Link to="/deals" className={styles.link}>
            Deals
          </Link>
          <Link to="/whats-new" className={styles.link}>
            What&apos;s New
          </Link>
          <Link to="/delivery" className={styles.link}>
            Delivery
          </Link>
        </nav>

        <div className={styles.searchWrap}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search Product"
          />
          <button
            type="button"
            className={styles.searchBtn}
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </div>

        <div className={styles.actions}>
          <Link to="/account" className={styles.actionLink}>
            <User size={18} />
            <span>Account</span>
          </Link>

          <Link to="/cart" className={styles.actionLink}>
            <ShoppingCart size={18} />
            <span>Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
