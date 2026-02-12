import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./AccountSignup.module.css";
import { register, setSession } from "../lib/auth";

export default function AccountSignup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("BUYER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      };

      const data = await register(payload);
      setSession(data.token, data.user);
      navigate("/account");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>Account Signup</p>
          <h1 className={styles.title}>Create your DaveDeals account</h1>
          <p className={styles.subtitle}>
            Start shopping, save favorites, and track orders in one place.
          </p>
        </div>
        <div className={styles.formCard}>
          <h2>Get started</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label>
              Full name
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              Email address
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </label>
            <label>
              Account type
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={styles.select}
              >
                <option value="BUYER">Buyer</option>
                <option value="SELLER">Seller</option>
              </select>
            </label>
            {error ? <p className={styles.error}>{error}</p> : null}
            <button type="submit" className={styles.primaryBtn} disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </button>
            <p className={styles.note}>
              Already have an account? <Link to="/account-signin">Sign in</Link>
            </p>
          </form>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Saved items</h3>
          <p>Keep track of your favorite products and deals.</p>
        </div>
        <div className={styles.card}>
          <h3>Order tracking</h3>
          <p>View shipment status and updates in real time.</p>
        </div>
        <div className={styles.card}>
          <h3>Seller tools</h3>
          <p>Publish products and manage your store inventory as a seller.</p>
        </div>
      </div>
    </section>
  );
}
