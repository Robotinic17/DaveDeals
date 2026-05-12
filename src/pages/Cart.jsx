import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  getCartTotals,
  loadCart,
  removeFromCart,
  updateCartItemQuantity,
} from "../lib/cart";
import styles from "./Cart.module.css";
import { formatNaira } from "../lib/currency";

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => loadCart());

  useEffect(() => {
    setItems(loadCart());
  }, []);

  const totals = useMemo(() => getCartTotals(items), [items]);

  function handleQuantityChange(id, quantity) {
    setItems(updateCartItemQuantity(id, quantity));
  }

  function handleRemove(id) {
    setItems(removeFromCart(id));
  }

  return (
    <section className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>Shopping bag</p>
            <h1 className={styles.title}>Your Cart</h1>
          </div>
          <Link to="/categories" className={styles.continueLink}>
            Continue shopping
          </Link>
        </header>

        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyCard}>
              <p className={styles.emptyTitle}>Your cart is empty.</p>
              <p className={styles.emptyText}>
                Add a product from the home page or any product page to see it
                here.
              </p>
              <Link to="/categories" className={styles.emptyAction}>
                Browse products
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.layout}>
            <div className={styles.itemsList}>
              {items.map((item) => (
                <article key={item.id} className={styles.itemCard}>
                  <img
                    src={item.thumbnail || "/fallback-product.png"}
                    alt={item.title}
                    className={styles.itemImage}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = "/fallback-product.png";
                    }}
                  />
                  <div className={styles.itemBody}>
                    <h2 className={styles.itemTitle}>{item.title}</h2>
                    <p className={styles.itemMeta}>
                      {formatNaira(Number(item.price || 0), "Price N/A", "NGN")}{" "}
                      each
                    </p>
                    <div className={styles.itemActions}>
                      <label className={styles.qtyField}>
                        <span>Qty</span>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(event) =>
                            handleQuantityChange(
                              item.id,
                              Number(event.target.value || 1),
                            )
                          }
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className={styles.removeBtn}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className={styles.itemPrice}>
                    {formatNaira(
                      Number(item.price || 0) * Number(item.quantity || 1),
                      "Price N/A",
                      "NGN",
                    )}
                  </div>
                </article>
              ))}
            </div>

            <aside className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Order summary</p>
              <div className={styles.summaryRow}>
                <span>Items</span>
                <strong>{totals.count}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <strong>
                  {formatNaira(totals.subtotal, "Price N/A", "NGN")}
                </strong>
              </div>
              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className={styles.checkoutBtn}
              >
                Proceed to checkout
              </button>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
