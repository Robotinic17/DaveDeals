import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutGrid,
  Package2,
  Send,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";
import styles from "./AdminPortal.module.css";
import {
  approveSellerApplication,
  fetchAdminOverview,
  fetchAdminProducts,
  fetchAdminSellers,
  fetchSellerApplications,
  getSessionUser,
  rejectSellerApplication,
  updateAdminProductStatus,
} from "../lib/auth";

const statMeta = [
  { key: "users", label: "Registered users", icon: Users },
  { key: "sellers", label: "Active sellers", icon: Store },
  {
    key: "pendingSellerApplications",
    label: "Pending seller requests",
    icon: ShieldCheck,
  },
  { key: "pendingProducts", label: "Pending product reviews", icon: Send },
  { key: "products", label: "Products", icon: Package2 },
];

function ProgressBar({ score }) {
  return (
    <div className={styles.progressTrack} aria-hidden="true">
      <div className={styles.progressValue} style={{ width: `${score}%` }} />
    </div>
  );
}

export default function AdminPortal() {
  const user = getSessionUser();
  const [overview, setOverview] = useState(null);
  const [applications, setApplications] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [rejectReasons, setRejectReasons] = useState({});
  const [productRejectReasons, setProductRejectReasons] = useState({});

  async function loadDashboard() {
    const [overviewData, applicationsData, sellersData, productsData] =
      await Promise.all([
        fetchAdminOverview(),
        fetchSellerApplications(),
        fetchAdminSellers(),
        fetchAdminProducts(),
      ]);

    setOverview(overviewData);
    setApplications(Array.isArray(applicationsData) ? applicationsData : []);
    setSellers(Array.isArray(sellersData) ? sellersData : []);
    setProducts(Array.isArray(productsData) ? productsData : []);
  }

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        await loadDashboard();
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to load admin dashboard");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  async function handleApprove(applicationId) {
    setBusyId(applicationId);
    setError("");

    try {
      await approveSellerApplication(applicationId);
      await loadDashboard();
    } catch (err) {
      setError(err.message || "Approval failed");
    } finally {
      setBusyId("");
    }
  }

  async function handleReject(applicationId) {
    const reason = String(rejectReasons[applicationId] || "").trim();
    if (!reason) {
      setError("Add a rejection reason before rejecting the seller request");
      return;
    }

    setBusyId(applicationId);
    setError("");

    try {
      await rejectSellerApplication(applicationId, reason);
      setRejectReasons((current) => {
        const next = { ...current };
        delete next[applicationId];
        return next;
      });
      await loadDashboard();
    } catch (err) {
      setError(err.message || "Rejection failed");
    } finally {
      setBusyId("");
    }
  }

  async function handleProductStatus(productId, status) {
    setBusyId(productId);
    setError("");

    try {
      await updateAdminProductStatus(productId, status);
      await loadDashboard();
    } catch (err) {
      setError(err.message || "Product update failed");
    } finally {
      setBusyId("");
    }
  }

  async function handleProductReject(productId) {
    const reason = String(productRejectReasons[productId] || "").trim();
    if (!reason) {
      setError("Add a rejection reason before rejecting the product");
      return;
    }

    setBusyId(productId);
    setError("");

    try {
      await updateAdminProductStatus(productId, "REJECTED", reason);
      setProductRejectReasons((current) => {
        const next = { ...current };
        delete next[productId];
        return next;
      });
      await loadDashboard();
    } catch (err) {
      setError(err.message || "Product update failed");
    } finally {
      setBusyId("");
    }
  }

  const pendingApplications = useMemo(
    () => applications.filter((item) => item.status === "PENDING"),
    [applications],
  );

  const topSellers = useMemo(() => sellers.slice(0, 6), [sellers]);
  const pendingProducts = useMemo(
    () => products.filter((item) => item.status === "PENDING_APPROVAL"),
    [products],
  );

  return (
    <section className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Admin Dashboard</p>
            <h1>Marketplace control for {user?.name || "Admin"}</h1>
            <p className={styles.lead}>
              Review seller requests, approve products, and keep the operating
              shape of DaveDeals under control from one place.
            </p>
            <div className={styles.heroActions}>
              <Link to="/account" className={styles.primaryBtn}>
                Open account
              </Link>
              <Link to="/" className={styles.secondaryBtn}>
                View storefront
              </Link>
            </div>
          </div>

          <aside className={styles.heroAside}>
            <div className={styles.heroBadge}>
              <LayoutGrid size={20} />
              <span>
                {overview?.pendingProducts || 0} product
                {(overview?.pendingProducts || 0) === 1 ? "" : "s"} waiting
                for review
              </span>
            </div>
            <p className={styles.heroAsideText}>
              Sellers can draft and submit products, but only admin-approved
              products reach the live storefront.
            </p>
          </aside>
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}

        {loading ? (
          <p className={styles.loading}>Loading admin dashboard...</p>
        ) : (
          <>
            <section className={styles.statsGrid}>
              {statMeta.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.key} className={styles.statCard}>
                    <div className={styles.statIcon}>
                      <Icon size={18} />
                    </div>
                    <p className={styles.statLabel}>{item.label}</p>
                    <p className={styles.statValue}>
                      {overview?.[item.key] ?? 0}
                    </p>
                  </article>
                );
              })}
            </section>

            <div className={styles.content}>
              <section className={styles.panel}>
                <div className={styles.panelHead}>
                  <div>
                    <p className={styles.panelKicker}>Seller approvals</p>
                    <h2>Pending requests</h2>
                  </div>
                  <span className={styles.countPill}>
                    {pendingApplications.length}
                  </span>
                </div>

                {pendingApplications.length ? (
                  <div className={styles.requestList}>
                    {pendingApplications.map((application) => (
                      <article key={application.id} className={styles.requestCard}>
                        <div className={styles.requestBody}>
                          <p className={styles.requestName}>{application.name}</p>
                          <p className={styles.requestMeta}>{application.email}</p>
                          <p className={styles.requestMeta}>
                            Applied {new Date(application.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <label className={styles.reasonField}>
                          <span>Rejection reason</span>
                          <textarea
                            rows={3}
                            value={rejectReasons[application.id] || ""}
                            onChange={(event) =>
                              setRejectReasons((current) => ({
                                ...current,
                                [application.id]: event.target.value,
                              }))
                            }
                            placeholder="Tell the applicant exactly what needs to be fixed."
                          />
                        </label>
                        <div className={styles.inlineActions}>
                          <button
                            type="button"
                            className={styles.primaryBtn}
                            disabled={busyId === application.id}
                            onClick={() => handleApprove(application.id)}
                          >
                            {busyId === application.id ? "Working..." : "Approve seller"}
                          </button>
                          <button
                            type="button"
                            className={styles.secondaryBtn}
                            disabled={busyId === application.id}
                            onClick={() => handleReject(application.id)}
                          >
                            Reject
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className={styles.emptyText}>
                    No pending seller applications right now.
                  </p>
                )}
              </section>

              <section className={styles.panel}>
                <div className={styles.panelHead}>
                  <div>
                    <p className={styles.panelKicker}>Seller roster</p>
                    <h2>Current sellers</h2>
                  </div>
                  <span className={styles.countPill}>{sellers.length}</span>
                </div>

                {topSellers.length ? (
                  <div className={styles.sellerList}>
                    {topSellers.map((seller) => (
                      <article key={seller.id} className={styles.sellerCard}>
                        <div className={styles.sellerHead}>
                          <div>
                            <p className={styles.requestName}>
                              {seller.storeName || seller.user?.name || "Unnamed store"}
                            </p>
                            <p className={styles.requestMeta}>
                              {seller.user?.email}
                            </p>
                          </div>
                          <span
                            className={`${styles.stateBadge} ${
                              seller.onboarding?.isComplete
                                ? styles.stateReady
                                : styles.stateSetup
                            }`}
                          >
                            {seller.onboarding?.isComplete ? "Ready" : "Setup in progress"}
                          </span>
                        </div>

                        <div className={styles.scoreRow}>
                          <span className={styles.scoreLabel}>Onboarding score</span>
                          <span className={styles.scoreValue}>
                            {seller.onboarding?.score || 0}/100
                          </span>
                        </div>
                        <ProgressBar score={seller.onboarding?.score || 0} />

                        <div className={styles.sellerMetaGrid}>
                          <p className={styles.requestMeta}>
                            Region: {seller.region?.name || "Not set"}
                          </p>
                          <p className={styles.requestMeta}>
                            Products: {seller._count?.products || 0}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className={styles.emptyText}>No sellers approved yet.</p>
                )}
              </section>
            </div>

            <section className={styles.panel}>
              <div className={styles.panelHead}>
                <div>
                  <p className={styles.panelKicker}>Product moderation</p>
                  <h2>Pending product reviews</h2>
                </div>
                <span className={styles.countPill}>{pendingProducts.length}</span>
              </div>

              {pendingProducts.length ? (
                <div className={styles.requestList}>
                  {pendingProducts.map((product) => (
                    <article key={product.id} className={styles.requestCard}>
                      {product.images?.[0] ? (
                        <div className={styles.productPreview}>
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      ) : null}
                      <div className={styles.requestBody}>
                        <p className={styles.requestName}>{product.title}</p>
                        <p className={styles.requestMeta}>
                          Seller: {product.seller?.storeName || "Unnamed store"}
                        </p>
                        <p className={styles.requestMeta}>
                          {product.currency} {product.price} -{" "}
                          {product.region?.name || "No region"}
                        </p>
                        <p className={styles.requestMeta}>
                          {product.description || "No description added."}
                        </p>
                      </div>
                      <label className={styles.reasonField}>
                        <span>Rejection reason</span>
                        <textarea
                          rows={3}
                          value={productRejectReasons[product.id] || ""}
                          onChange={(event) =>
                            setProductRejectReasons((current) => ({
                              ...current,
                              [product.id]: event.target.value,
                            }))
                          }
                          placeholder="Explain what the seller must fix before resubmitting."
                        />
                      </label>
                      <div className={styles.inlineActions}>
                        <button
                          type="button"
                          className={styles.primaryBtn}
                          disabled={busyId === product.id}
                          onClick={() =>
                            handleProductStatus(product.id, "PUBLISHED")
                          }
                        >
                          {busyId === product.id ? "Working..." : "Approve & publish"}
                        </button>
                        <button
                          type="button"
                          className={styles.secondaryBtn}
                          disabled={busyId === product.id}
                          onClick={() => handleProductReject(product.id)}
                        >
                          Reject
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className={styles.emptyText}>
                  No products are waiting for admin review right now.
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </section>
  );
}
