import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { clearCart, getCartTotals, loadCart } from "../lib/cart";
import {
  createOrder,
  initializeCheckout,
  isSignedIn,
  getSessionUser,
  verifyCheckout,
} from "../lib/auth";

function toCents(amount) {
  return Math.round(Number(amount || 0) * 100);
}

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState(() => loadCart());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("paystack"); // "paystack" or "mock"
  const [shipping, setShipping] = useState(() => {
    const user = getSessionUser();
    return {
      fullName: user?.name || "",
      email: user?.email || "",
      address: "",
      city: "",
      country: "",
    };
  });

  const totals = useMemo(() => getCartTotals(items), [items]);

  // Check for payment callback
  useEffect(() => {
    const paymentStatus = searchParams.get("payment_status");
    const reference = searchParams.get("reference");

    if (paymentStatus === "completed" && reference) {
      handlePaymentCallback(reference);
    }
  }, [searchParams]);

  function redirectToSignin() {
    navigate(`/account-signin?next=${encodeURIComponent("/checkout")}`);
  }

  useEffect(() => {
    if (!isSignedIn()) {
      redirectToSignin();
    }
  }, []);

  async function handlePaymentCallback(reference) {
    try {
      setIsSubmitting(true);
      setError("");

      const response = await verifyCheckout(reference);
      clearCart();
      setItems([]);
      setSuccess(response);
      // Clear query params
      window.history.replaceState({}, "", "/checkout");
    } catch (err) {
      setError(err.message || "Payment verification failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePlaceOrder(event) {
    event.preventDefault();
    setError("");

    if (!isSignedIn()) {
      redirectToSignin();
      return;
    }

    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (paymentMethod === "paystack") {
        // Initialize Paystack payment
        const response = await initializeCheckout({
          items: items.map((item) => ({
            productId: String(item.id),
            quantity: Number(item.quantity || 1),
          })),
          shippingAddress: shipping,
        });

        if (response.success && response.payment?.authorizationUrl) {
          // Redirect to Paystack
          window.location.href = response.payment.authorizationUrl;
        } else {
          setError("Failed to initialize payment");
        }
      } else {
        // Mock payment flow
        const response = await createOrder({
          items: items.map((item) => ({
            productId: String(item.id),
            quantity: Number(item.quantity || 1),
          })),
          paymentMethod: "MOCK_CARD",
          paymentReference: `mock_${Date.now()}`,
          shippingAddress: shipping,
        });

        clearCart();
        setItems([]);
        setSuccess(response);
      }
    } catch (submitError) {
      setError(submitError.message || "Checkout failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isSignedIn()) {
    return null;
  }

  return (
    <section style={{ maxWidth: 780, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ marginBottom: "0.35rem" }}>Checkout</h1>
      <p style={{ marginTop: 0, marginBottom: "1.25rem", color: "#4b5563" }}>
        {paymentMethod === "paystack"
          ? "Secure payment via Paystack"
          : "Demo payment mode: no real money transfer happens."}
      </p>

      {success ? (
        <div
          style={{
            border: "1px solid #bbf7d0",
            background: "#f0fdf4",
            borderRadius: 12,
            padding: "1rem",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Order placed successfully!</h2>
          <p style={{ marginBottom: "0.4rem" }}>
            Order ID: <strong>{success.order?.id}</strong>
          </p>
          <p style={{ marginBottom: "0.4rem" }}>
            Payment:{" "}
            <strong>
              {success.payment?.status || success.payment?.provider}
            </strong>
          </p>
          <p
            style={{ marginBottom: "1rem", fontSize: "0.9rem", color: "#666" }}
          >
            A confirmation email has been sent to {shipping.email}
          </p>
          <Link to="/categories">Continue shopping</Link>
        </div>
      ) : isSubmitting && paymentMethod === "paystack" ? (
        <div
          style={{
            border: "1px solid #bfdbfe",
            background: "#f0f9ff",
            borderRadius: 12,
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <p style={{ marginTop: 0, marginBottom: 0 }}>
            <strong>Redirecting to Paystack...</strong>
          </p>
        </div>
      ) : (
        <form
          onSubmit={handlePlaceOrder}
          style={{ display: "grid", gap: "1rem" }}
        >
          <fieldset
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: "1rem",
            }}
          >
            <legend>Shipping details</legend>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <input
                placeholder="Full name"
                value={shipping.fullName}
                onChange={(event) =>
                  setShipping((prev) => ({
                    ...prev,
                    fullName: event.target.value,
                  }))
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={shipping.email}
                onChange={(event) =>
                  setShipping((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
                required
              />
              <input
                placeholder="Address"
                value={shipping.address}
                onChange={(event) =>
                  setShipping((prev) => ({
                    ...prev,
                    address: event.target.value,
                  }))
                }
                required
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                }}
              >
                <input
                  placeholder="City"
                  value={shipping.city}
                  onChange={(event) =>
                    setShipping((prev) => ({
                      ...prev,
                      city: event.target.value,
                    }))
                  }
                  required
                />
                <input
                  placeholder="Country"
                  value={shipping.country}
                  onChange={(event) =>
                    setShipping((prev) => ({
                      ...prev,
                      country: event.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
          </fieldset>

          <fieldset
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: "1rem",
            }}
          >
            <legend>Payment method</legend>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <label
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paystack"
                  checked={paymentMethod === "paystack"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Paystack (Recommended)</span>
              </label>
              <label
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mock"
                  checked={paymentMethod === "mock"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Demo/Mock Payment</span>
              </label>
            </div>
          </fieldset>

          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: "1rem",
            }}
          >
            <p style={{ margin: 0, fontWeight: 600 }}>
              {totals.count} item(s) • Total ₦{totals.subtotal.toFixed(2)}
            </p>
          </div>

          {error ? (
            <p style={{ color: "#b91c1c", margin: 0 }}>{error}</p>
          ) : null}

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              type="submit"
              disabled={isSubmitting || !items.length}
              style={{
                background: "#111827",
                color: "white",
                border: "none",
                borderRadius: 10,
                padding: "0.7rem 1rem",
                cursor: "pointer",
                opacity: isSubmitting || !items.length ? 0.5 : 1,
              }}
            >
              {isSubmitting
                ? "Processing..."
                : paymentMethod === "paystack"
                  ? "Proceed to Paystack"
                  : "Place demo order"}
            </button>
            <Link to="/cart">Back to cart</Link>
          </div>
        </form>
      )}
    </section>
  );
}
