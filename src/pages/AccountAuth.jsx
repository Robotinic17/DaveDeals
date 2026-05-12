import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./AccountAuth.module.css";
import { forgotPassword, login, register, setSession } from "../lib/auth";
import signupArt from "../assets/signup.png";
import signinArt from "../assets/Login-PNG-Photos.png";

function GoogleIcon() {
  return (
    <svg className={styles.providerSvg} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9a6 6 0 0 1 0-12c2.2 0 3.7.9 4.6 1.7l3.1-3A10.4 10.4 0 0 0 12 2a10 10 0 1 0 0 20c5.8 0 9.6-4 9.6-9.7 0-.7-.1-1.3-.2-2H12z"
      />
      <path
        fill="currentColor"
        d="M3.2 7.3 6.4 9.7A6 6 0 0 1 12 6c2.2 0 3.7.9 4.6 1.7l3.1-3A10.4 10.4 0 0 0 12 2 10 10 0 0 0 3.2 7.3z"
      />
      <path
        fill="currentColor"
        d="M12 22c2.7 0 5-1 6.7-2.6l-3.2-2.7c-.9.6-2.1 1.2-3.5 1.2-2.9 0-5.3-1.9-6.1-4.6l-3.3 2.6A10 10 0 0 0 12 22z"
      />
      <path
        fill="currentColor"
        d="M5.9 13.3A6 6 0 0 1 5.6 12c0-.5.1-.9.2-1.3L2.5 8A10 10 0 0 0 2 12c0 1.4.3 2.8.9 4z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      className={styles.providerSvg}
      viewBox="0 0 24 24"
      width="36"
      height="36"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M16.8 12.7c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.4.8-3 .8-.6 0-1.6-.8-2.6-.8-1.3 0-2.6.8-3.3 2-.7 1.2-1.8 3.5-.5 6 .6 1.2 1.4 2.5 2.5 2.5 1 0 1.4-.6 2.6-.6s1.5.6 2.6.6c1.1 0 1.8-1 2.4-2.1.7-1.2 1-2.4 1-2.4-.1 0-2-.8-2-3.2zm-2.1-6.1c.5-.6.9-1.3.8-2.1-.8 0-1.6.5-2.1 1.1-.5.6-.9 1.4-.8 2.2.9.1 1.7-.4 2.1-1.2z"
      />
    </svg>
  );
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
  const [hint, setHint] = useState("");
  const [showSigninPassword, setShowSigninPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupRepeatPassword, setShowSignupRepeatPassword] =
    useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showForgotRepeatPassword, setShowForgotRepeatPassword] =
    useState(false);

  const title =
    mode === "signin"
      ? "Hello!"
      : mode === "signup"
        ? "Create account"
        : "Reset password";
  const subtitle =
    mode === "signin"
      ? "We are glad to see you :)"
      : mode === "signup"
        ? "Join DaveDeals in less than a minute."
        : "Enter your email and choose a new password.";
  const illustrationSrc = mode === "signup" ? signupArt : signinArt;
  const illustrationAlt =
    mode === "signup" ? "Signup illustration" : "Login illustration";

  const switchText = useMemo(() => {
    if (mode === "signin") {
      return { prompt: "No account yet?", action: "Create account" };
    }

    if (mode === "signup") {
      return { prompt: "Already have an account?", action: "Sign in" };
    }

    return { prompt: "Remembered it?", action: "Sign in" };
  }, [mode]);
  const nextPath = searchParams.get("next");

  function getDefaultDestination(role) {
    if (role === "ADMIN") return "/admin";
    if (role === "SELLER") return "/seller";
    return "/account";
  }

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

    if (mode === "forgot") {
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password !== repeatPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        email: email.trim().toLowerCase(),
        password,
      };

      if (mode === "forgot") {
        await forgotPassword(payload);
        setHint("Password reset successful. You can sign in now.");
        setMode("signin");
        setPassword("");
        setRepeatPassword("");
        return;
      }

      const data =
        mode === "signin"
          ? await login(payload)
          : await register({
              ...payload,
              name: name.trim(),
              role: "BUYER",
            });

      setSession(data.token, data.user);
      navigate(nextPath || getDefaultDestination(data.user?.role));
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
      <article
        className={`${styles.shell} ${mode === "signup" ? styles.shellSignup : styles.shellSignin}`}
      >
        <div className={styles.right}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>

          <p className={styles.switchLine}>
            {switchText.prompt}{" "}
            <button
              type="button"
              className={styles.inlineAction}
              onClick={() => {
                if (mode === "signin") {
                  switchMode("signup");
                  return;
                }
                switchMode("signin");
              }}
            >
              {switchText.action}
            </button>
          </p>

          {mode !== "forgot" ? (
            <div className={styles.providerRow}>
              <button
                type="button"
                className={styles.providerBtn}
                onClick={() => onProviderClick("Google")}
              >
                <GoogleIcon />{" "}
                {mode === "signin"
                  ? "Sign in with Google"
                  : "Sign up with Google"}
              </button>
              <button
                type="button"
                className={styles.providerBtn}
                onClick={() => onProviderClick("Apple")}
              >
                <AppleIcon />{" "}
                {mode === "signin"
                  ? "Sign in with Apple"
                  : "Sign up with Apple"}
              </button>
            </div>
          ) : null}

          {mode !== "forgot" ? (
            <div className={styles.separator}>
              <span>or</span>
            </div>
          ) : null}

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
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={showSignupPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      className={styles.eyeToggle}
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      {showSignupPassword ? (
                        <Eye size={18} />
                      ) : (
                        <EyeOff size={18} />
                      )}
                    </button>
                  </div>
                </label>
                <label>
                  Repeat Password
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={showSignupRepeatPassword ? "text" : "password"}
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      className={styles.eyeToggle}
                      onClick={() =>
                        setShowSignupRepeatPassword(!showSignupRepeatPassword)
                      }
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      {showSignupRepeatPassword ? (
                        <Eye size={18} />
                      ) : (
                        <EyeOff size={18} />
                      )}
                    </button>
                  </div>
                </label>
              </div>
            ) : mode === "forgot" ? (
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
                  New Password
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={showForgotPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      className={styles.eyeToggle}
                      onClick={() => setShowForgotPassword(!showForgotPassword)}
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      {showForgotPassword ? (
                        <Eye size={18} />
                      ) : (
                        <EyeOff size={18} />
                      )}
                    </button>
                  </div>
                </label>
                <label>
                  Repeat New Password
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={showForgotRepeatPassword ? "text" : "password"}
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      className={styles.eyeToggle}
                      onClick={() =>
                        setShowForgotRepeatPassword(!showForgotRepeatPassword)
                      }
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      {showForgotRepeatPassword ? (
                        <Eye size={18} />
                      ) : (
                        <EyeOff size={18} />
                      )}
                    </button>
                  </div>
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
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={showSigninPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className={styles.eyeToggle}
                      onClick={() => setShowSigninPassword(!showSigninPassword)}
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      {showSigninPassword ? (
                        <Eye size={18} />
                      ) : (
                        <EyeOff size={18} />
                      )}
                    </button>
                  </div>
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
                onClick={() => switchMode("forgot")}
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
                  : mode === "signup"
                    ? "Sign Up"
                    : "Reset Password"}
            </button>
          </form>

          <div className={styles.footerLine}>
            <Link to="/">Back to home</Link>
          </div>
        </div>

        <aside className={styles.left}>
          <div className={styles.scene} aria-label="Illustration panel">
            <div className={styles.artPlaceholder}>
              <img
                src={illustrationSrc}
                alt={illustrationAlt}
                className={styles.artImage}
              />
            </div>
          </div>
        </aside>
      </article>
    </section>
  );
}
