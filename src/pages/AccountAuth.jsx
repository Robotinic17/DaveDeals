import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import styles from "./AccountAuth.module.css";
import { login, register, setSession } from "../lib/auth";

function GoogleIcon() {
  return <span className={styles.providerGlyph}>G</span>;
}

function AppleIcon() {
  return <span className={styles.providerGlyph}>A</span>;
}

export default function AccountAuth({ initialMode = "signin" }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(
    initialMode === "signup" ? "signup" : "signin",
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hint, setHint] = useState(
    searchParams.get("reason") === "forgot"
      ? "Create your account first, then password reset will be enabled later."
      : "",
  );

  const title = mode === "signin" ? "Hello!" : "Create account";
  const subtitle =
    mode === "signin"
      ? "We are glad to see you :)"
      : "Join DaveDeals in less than a minute.";
  const illustrationHint =
    mode === "signin"
      ? "Place login illustration here"
      : "Place signup illustration here";

  const switchText = useMemo(
    () =>
      mode === "signin"
        ? { prompt: "No account yet?", action: "Create account" }
        : { prompt: "Already have an account?", action: "Sign in" },
    [mode],
  );

  function onProviderClick(provider) {
    setHint(`${provider} sign-in is coming soon.`);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setHint("");

    if (mode === "signup") {
      if (password !== repeatPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (!accepted) {
        setError("Please accept Terms and Privacy Policy.");
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        email: email.trim().toLowerCase(),
        password,
      };

      const data =
        mode === "signin"
          ? await login(payload)
          : await register({
              ...payload,
              name: name.trim(),
              role: "BUYER",
            });

      setSession(data.token, data.user);
      navigate("/account");
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
    setHint("");
  }

  return (
    <section className={styles.overlay}>
      <article className={styles.shell}>
        <aside className={styles.left}>
          <div className={styles.scene} aria-label="Illustration panel">
            <p className={styles.welcomeWord}>WELCOME</p>
            <div className={styles.artPlaceholder}>{illustrationHint}</div>
          </div>
        </aside>

        <div className={styles.right}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>

          <p className={styles.switchLine}>
            {switchText.prompt}{" "}
            <button
              type="button"
              className={styles.inlineAction}
              onClick={() =>
                switchMode(mode === "signin" ? "signup" : "signin")
              }
            >
              {switchText.action}
            </button>
          </p>

          <div className={styles.providerRow}>
            <button
              type="button"
              className={styles.providerBtn}
              onClick={() => onProviderClick("Google")}
            >
              <GoogleIcon /> Sign up with Google
            </button>
            <button
              type="button"
              className={styles.providerBtnSmall}
              onClick={() => onProviderClick("Apple")}
            >
              <AppleIcon />
            </button>
            <button
              type="button"
              className={styles.providerBtnSmall}
              onClick={() => onProviderClick("Twitter")}
            >
              T
            </button>
          </div>

          <div className={styles.separator}>
            <span>or</span>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {mode === "signup" ? (
              <div className={styles.formGrid}>
                <label>
                  Name
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Email Address
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </label>
                <label>
                  Repeat Password
                  <input
                    type="password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </label>
              </div>
            ) : (
              <div className={styles.formStack}>
                <label>
                  Email Address
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </label>
              </div>
            )}

            {mode === "signup" ? (
              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                <span>
                  I agree to <a href="#terms">Terms of Service</a> and{" "}
                  <a href="#privacy">Privacy Policy</a>
                </span>
              </label>
            ) : null}

            {mode === "signin" ? (
              <button
                type="button"
                className={styles.ghostLink}
                onClick={() => switchMode("signup")}
              >
                Forgot password?
              </button>
            ) : null}

            {error ? <p className={styles.error}>{error}</p> : null}
            {hint ? <p className={styles.hint}>{hint}</p> : null}

            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "signin"
                  ? "Sign In"
                  : "Sign Up"}
            </button>
          </form>

          <div className={styles.footerLine}>
            <Link to="/">Back to home</Link>
          </div>
        </div>
      </article>
    </section>
  );
}
