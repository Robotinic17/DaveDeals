import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  Clock3,
  OctagonAlert,
  Store,
  ShieldCheck,
  Mail,
  Sparkles,
} from "lucide-react";
import styles from "./BecomeSeller.module.css";
import {
  fetchMySellerApplication,
  getSessionUser,
  submitSellerApplication,
} from "../lib/auth";

export default function BecomeSeller() {
  const user = getSessionUser();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [application, setApplication] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadStatus() {
      try {
        const data = await fetchMySellerApplication();
        if (!active) return;
        setApplication(data);
      } catch (_err) {
        if (!active) return;
        setApplication(null);
      } finally {
        if (active) {
          setStatusLoading(false);
        }
      }
    }

    loadStatus();
    return () => {
      active = false;
    };
  }, []);

  const currentStatus = application?.status || null;
  const formLocked = currentStatus === "PENDING" || currentStatus === "APPROVED";

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await submitSellerApplication({
        name: name.trim(),
        email: email.trim(),
      });
      setApplication(data.application || null);
      setSuccess(data.message || "Application submitted");
    } catch (err) {
      setError(err.message || "Could not submit application");
    } finally {
      setLoading(false);
    }
  }

  function renderStatusCard() {
    if (statusLoading) {
      return (
        <div className={styles.statusCard}>
          <p className={styles.statusTitle}>Checking request status...</p>
        </div>
      );
    }

    if (currentStatus === "PENDING") {
      return (
        <div className={`${styles.statusCard} ${styles.pendingCard}`}>
          <div className={styles.statusIcon}>
            <Clock3 size={18} />
          </div>
          <div>
            <p className={styles.statusEyebrow}>Review in progress</p>
            <p className={styles.statusTitle}>Your seller request is pending</p>
            <p className={styles.statusBody}>
              Admin has received your application. We will review your details
              and unlock seller access after approval.
            </p>
          </div>
        </div>
      );
    }

    if (currentStatus === "APPROVED") {
      return (
        <div className={`${styles.statusCard} ${styles.approvedCard}`}>
          <div className={styles.statusIcon}>
            <Sparkles size={18} />
          </div>
          <div>
            <p className={styles.statusEyebrow}>Seller access approved</p>
            <p className={styles.statusTitle}>You are ready for the seller portal</p>
            <p className={styles.statusBody}>
              Your request has been approved. Sign out, then sign in again so
              your account reloads with seller access.
            </p>
          </div>
        </div>
      );
    }

    if (currentStatus === "REJECTED") {
      return (
        <div className={`${styles.statusCard} ${styles.rejectedCard}`}>
          <div className={styles.statusIcon}>
            <OctagonAlert size={18} />
          </div>
          <div>
            <p className={styles.statusEyebrow}>Seller request rejected</p>
            <p className={styles.statusTitle}>
              Your application needs changes before approval
            </p>
            <p className={styles.statusBody}>
              {application?.adminNotes ||
                "Admin reviewed your request and asked for corrections before seller access can be approved."}
            </p>
            <p className={styles.statusBody}>
              Update your details and submit a fresh request when ready.
            </p>
          </div>
        </div>
      );
    }

    return null;
  }

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.copy}>
          <p className={styles.kicker}>Seller Onboarding</p>
          <h1>Apply to become a seller on DaveDeals</h1>
          <p className={styles.lead}>
            We review every seller request manually. This keeps the marketplace
            cleaner, reduces fraud, and gives buyers more confidence when they
            shop from new stores.
          </p>
          <div className={styles.points}>
            <div className={styles.point}>
              <Store size={18} />
              <span>Start as a buyer, then apply for seller access.</span>
            </div>
            <div className={styles.point}>
              <ShieldCheck size={18} />
              <span>Name and email are reviewed before approval.</span>
            </div>
            <div className={styles.point}>
              <Mail size={18} />
              <span>Admin gets an in-dashboard request to review.</span>
            </div>
          </div>
        </div>

        <aside className={styles.panel}>
          <p className={styles.panelKicker}>Your request</p>
          <h2>Send your seller application</h2>
          <p className={styles.panelBody}>
            Use the same details attached to your buyer account so we can verify
            the request correctly.
          </p>
          {renderStatusCard()}

          <form className={styles.form} onSubmit={handleSubmit}>
            <label>
              Full name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={formLocked}
                required
              />
            </label>

            <label>
              Email address
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={formLocked}
                required
              />
            </label>

            {error ? <p className={styles.error}>{error}</p> : null}
            {success ? (
              <p className={styles.success}>
                <BadgeCheck size={16} /> {success}
              </p>
            ) : null}

            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={loading || formLocked}
            >
              {loading
                ? "Submitting..."
                : currentStatus === "PENDING"
                  ? "Request pending"
                  : currentStatus === "APPROVED"
                    ? "Approved"
                    : currentStatus === "REJECTED"
                      ? "Resubmit seller request"
                    : "Submit seller request"}
            </button>
          </form>

          <p className={styles.footnote}>
            Need to update your buyer profile first? <Link to="/account">Open account</Link>
          </p>
        </aside>
      </div>
    </section>
  );
}
