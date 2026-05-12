import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMyOrders } from "../lib/auth";

function toDollars(cents) {
  const value = Number(cents || 0);
  return (value / 100).toFixed(2);
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchMyOrders();
        if (!active) return;
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to load orders");
      } finally {
        if (!active) return;
        setLoading(false);
      }
    }

    loadOrders();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ marginTop: 0, marginBottom: "0.5rem" }}>My Orders</h1>
      <p style={{ marginTop: 0, marginBottom: "1.25rem", color: "#4b5563" }}>
        Your demo checkout orders appear here.
      </p>

      {loading ? <p>Loading orders...</p> : null}
      {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}

      {!loading && !error && orders.length === 0 ? (
        <div>
          <p style={{ marginBottom: "1rem" }}>You have no orders yet.</p>
          <Link to="/categories">Start shopping</Link>
        </div>
      ) : null}

      {!loading && !error && orders.length > 0 ? (
        <div style={{ display: "grid", gap: "1rem" }}>
          {orders.map((order) => (
            <article
              key={order.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                  marginBottom: "0.75rem",
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 700 }}>
                    Order #{order.id}
                  </p>
                  <p style={{ margin: "0.25rem 0 0", color: "#4b5563" }}>
                    Placed: {formatDate(order.createdAt)}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontWeight: 700 }}>
                    ${toDollars(order.total)} {order.currency || "USD"}
                  </p>
                  <p style={{ margin: "0.25rem 0 0", color: "#166534" }}>
                    Status: {order.status}
                  </p>
                </div>
              </div>

              <div style={{ display: "grid", gap: "0.5rem" }}>
                {Array.isArray(order.items) && order.items.length > 0 ? (
                  order.items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        borderTop: "1px solid #f3f4f6",
                        paddingTop: "0.5rem",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "0.75rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <span>{item.product?.title || "Product"}</span>
                      <span>
                        Qty {item.quantity} • ${toDollars(item.unitPrice)} each
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{ margin: 0, color: "#6b7280" }}>
                    No order items found.
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
