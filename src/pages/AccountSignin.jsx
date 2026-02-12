import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./AccountSignup.module.css";
import { login, setSession } from "../lib/auth";

export default function AccountSignin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login({
        email: email.trim().toLowerCase(),
        password,
      });
      setSession(data.token, data.user);
      navigate("/account");
    } catch (err) {
      setError(err.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>Account Signin</p>
          <h1 className={styles.title}>Welcome back to DaveDeals</h1>
          <p className={styles.subtitle}>
            Sign in to manage your orders, saved products, and seller tools.
          </p>
        </div>

        <div className={styles.formCard}>
          <h2>Sign in</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
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
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error ? <p className={styles.error}>{error}</p> : null}
            <button type="submit" className={styles.primaryBtn} disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <p className={styles.note}>
              New to DaveDeals? <Link to="/account-signup">Create account</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
