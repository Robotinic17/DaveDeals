import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  ChevronRight,
  CircleDollarSign,
  Image as ImageIcon,
  PackagePlus,
  MapPinned,
  PencilLine,
  Send,
  ReceiptText,
  ShieldCheck,
  Store,
} from "lucide-react";
import styles from "./SellerPortal.module.css";
import {
  createSellerProduct,
  fetchSellerProducts,
  fetchSellerProfile,
  getSessionUser,
  updateSellerProduct,
  updateSellerProfile,
} from "../lib/auth";
import { getMarketplaceCategories } from "../lib/catalog";

const initialForm = {
  storeName: "",
  businessType: "",
  phone: "",
  country: "",
  address: "",
  logoUrl: "",
  description: "",
  categories: "",
  preferredCurrency: "USD",
  regionId: "",
  termsAccepted: false,
};

const initialProductForm = {
  title: "",
  categorySlug: "",
  description: "",
  price: "",
  currency: "USD",
  regionId: "",
  images: "",
};

const stepMeta = {
  storeName: {
    icon: Store,
    title: "Store identity",
    body: "Give buyers a store name they can recognize immediately.",
  },
  businessDetails: {
    icon: ReceiptText,
    title: "Business details",
    body: "Tell us who is behind the store and where the business operates.",
  },
  branding: {
    icon: ImageIcon,
    title: "Branding",
    body: "Logo and description increase trust before the first order lands.",
  },
  categories: {
    icon: BadgeCheck,
    title: "Selling categories",
    body: "Tell DaveDeals what you plan to sell so the marketplace can classify your store properly.",
  },
  regionCurrency: {
    icon: MapPinned,
    title: "Region and currency",
    body: "These settings are used when future products and payouts are created.",
  },
  terms: {
    icon: ShieldCheck,
    title: "Seller terms",
    body: "Required before your account can become fully sell-ready.",
  },
};

function ProgressRing({ score }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <svg className={styles.ring} viewBox="0 0 140 140" aria-hidden="true">
      <circle className={styles.ringTrack} cx="70" cy="70" r={radius} />
      <circle
        className={styles.ringValue}
        cx="70"
        cy="70"
        r={radius}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
      />
      <text x="70" y="66" textAnchor="middle" className={styles.ringScore}>
        {score}
      </text>
      <text x="70" y="85" textAnchor="middle" className={styles.ringLabel}>
        /100
      </text>
    </svg>
  );
}

export default function SellerPortal() {
  const user = getSessionUser();
  const [seller, setSeller] = useState(null);
  const [onboarding, setOnboarding] = useState(null);
  const [regions, setRegions] = useState([]);
  const [catalogCategories, setCatalogCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [productForm, setProductForm] = useState(initialProductForm);
  const [productSaving, setProductSaving] = useState(false);
  const [productError, setProductError] = useState("");
  const [productSuccess, setProductSuccess] = useState("");
  const [productBusyId, setProductBusyId] = useState("");
  const [categoryQuery, setCategoryQuery] = useState("");
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [data, sellerProducts, categories] = await Promise.all([
          fetchSellerProfile(),
          fetchSellerProducts(),
          getMarketplaceCategories(),
        ]);
        if (!active) return;
        setSeller(data.seller);
        setOnboarding(data.onboarding);
        setRegions(Array.isArray(data.regions) ? data.regions : []);
        setCatalogCategories(Array.isArray(categories) ? categories : []);
        setProducts(Array.isArray(sellerProducts) ? sellerProducts : []);
        setForm({
          storeName: data.seller?.storeName || "",
          businessType: data.seller?.businessType || "",
          phone: data.seller?.phone || "",
          country: data.seller?.country || "",
          address: data.seller?.address || "",
          logoUrl: data.seller?.logoUrl || "",
          description: data.seller?.description || "",
          categories: Array.isArray(data.seller?.categories)
            ? data.seller.categories.join(", ")
            : "",
          preferredCurrency: data.seller?.preferredCurrency || "USD",
          regionId: data.seller?.regionId || "",
          termsAccepted: Boolean(data.seller?.termsAccepted),
        });
        setProductForm((current) => ({
          ...current,
          currency: data.seller?.preferredCurrency || "USD",
          regionId: data.seller?.regionId || "",
        }));
      } catch (err) {
        if (!active) return;
        setError(err.message || "Could not load seller profile");
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

  const remainingSteps = useMemo(() => {
    if (!onboarding?.steps) return [];
    return onboarding.steps.filter((step) => !step.complete);
  }, [onboarding]);
  const uploadsUnlocked = Boolean(onboarding?.isComplete);
  const filteredCategoryOptions = useMemo(() => {
    const needle = String(categoryQuery || "").trim().toLowerCase();
    const list = Array.isArray(catalogCategories) ? catalogCategories : [];
    if (!needle) return list.slice(0, 24);
    return list
      .filter((item) => {
        const name = String(item.name || "").toLowerCase();
        const slug = String(item.slug || "").toLowerCase();
        return name.includes(needle) || slug.includes(needle);
      })
      .slice(0, 16);
  }, [catalogCategories, categoryQuery]);

  async function refreshProducts() {
    const sellerProducts = await fetchSellerProducts();
    setProducts(Array.isArray(sellerProducts) ? sellerProducts : []);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const data = await updateSellerProfile(form);
      setSeller(data.seller);
      setOnboarding(data.onboarding);
      setSuccess(
        data.onboarding?.isComplete
          ? "Seller profile complete. You can now upload products."
          : "Seller profile updated. Keep going to unlock product uploads.",
      );
    } catch (err) {
      setError(err.message || "Could not save seller profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateProduct(event) {
    event.preventDefault();
    setProductSaving(true);
    setProductError("");
    setProductSuccess("");

    try {
      const selectedCategory =
        catalogCategories.find((item) => item.slug === productForm.categorySlug) ||
        catalogCategories.find(
          (item) => item.name.toLowerCase() === categoryQuery.trim().toLowerCase(),
        );

      if (!selectedCategory) {
        throw new Error("Select a valid product category");
      }

      const payload = {
        title: productForm.title.trim(),
        category: selectedCategory.name,
        categorySlug: selectedCategory.slug,
        description: productForm.description.trim(),
        price: Number(productForm.price),
        currency: productForm.currency,
        regionId: productForm.regionId || null,
        images: productForm.images
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await createSellerProduct(payload);
      await refreshProducts();
      setProductSuccess("Product draft created successfully.");
      setProductForm((current) => ({
        ...initialProductForm,
        currency: current.currency,
        regionId: current.regionId,
      }));
      setCategoryQuery("");
      setCategoryPickerOpen(false);
    } catch (err) {
      setProductError(err.message || "Could not create product");
    } finally {
      setProductSaving(false);
    }
  }

  async function handlePublishProduct(productId) {
    setProductBusyId(productId);
    setProductError("");
    setProductSuccess("");

    try {
      await updateSellerProduct(productId, { status: "PENDING_APPROVAL" });
      await refreshProducts();
      setProductSuccess("Product submitted for admin review.");
    } catch (err) {
      setProductError(err.message || "Could not submit product for review");
    } finally {
      setProductBusyId("");
    }
  }

  async function handleArchiveProduct(productId) {
    setProductBusyId(productId);
    setProductError("");
    setProductSuccess("");

    try {
      await updateSellerProduct(productId, { status: "ARCHIVED" });
      await refreshProducts();
      setProductSuccess("Product archived.");
    } catch (err) {
      setProductError(err.message || "Could not archive product");
    } finally {
      setProductBusyId("");
    }
  }

  if (loading) {
    return (
      <section className={styles.page}>
        <div className={styles.shell}>
          <p className={styles.loading}>Loading seller dashboard...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Seller Portal</p>
            <h1>Welcome, {seller?.storeName || user?.name || "Seller"}</h1>
            <p className={styles.lead}>
              Build a trustworthy storefront before you start listing products.
              You can skip around, but product uploads stay locked until the
              required seller profile steps are complete.
            </p>
            <div className={styles.heroMeta}>
              <span className={styles.metaPill}>
                <CircleDollarSign size={16} /> Uploads{" "}
                {onboarding?.isComplete ? "unlocked" : "locked"}
              </span>
              <span className={styles.metaPill}>
                {onboarding?.completedCount || 0}/{onboarding?.totalSteps || 0} steps complete
              </span>
            </div>
          </div>

          <aside className={styles.progressCard}>
            <ProgressRing score={onboarding?.score || 0} />
            <p className={styles.progressTitle}>
              {onboarding?.isComplete ? "Ready to sell" : "Seller onboarding"}
            </p>
            <p className={styles.progressBody}>
              {onboarding?.isComplete
                ? "Your seller account is complete. Next we can connect product creation and inventory."
                : `${remainingSteps.length} step${remainingSteps.length === 1 ? "" : "s"} left before uploads unlock.`}
            </p>
          </aside>
        </div>

        <div className={styles.content}>
          <section className={styles.checklistCard}>
            <div className={styles.cardHead}>
              <div>
                <p className={styles.cardKicker}>Checklist</p>
                <h2>What still needs attention</h2>
              </div>
              <Link to="/" className={styles.surfaceLink}>
                View storefront <ChevronRight size={16} />
              </Link>
            </div>

            <div className={styles.stepList}>
              {(onboarding?.steps || []).map((step) => {
                const meta = stepMeta[step.key];
                const Icon = meta?.icon || BadgeCheck;
                return (
                  <article
                    key={step.key}
                    className={`${styles.stepCard} ${step.complete ? styles.stepCardDone : ""}`}
                  >
                    <div className={styles.stepIcon}>
                      <Icon size={18} />
                    </div>
                    <div className={styles.stepCopy}>
                      <p className={styles.stepTitle}>
                        {meta?.title || step.label}
                      </p>
                      <p className={styles.stepBody}>
                        {meta?.body || step.label}
                      </p>
                    </div>
                    <span className={styles.stepStatus}>
                      {step.complete ? "Done" : `${step.weight}%`}
                    </span>
                  </article>
                );
              })}
            </div>
          </section>

          <section className={styles.formCard}>
            <div className={styles.cardHead}>
              <div>
                <p className={styles.cardKicker}>Store setup</p>
                <h2>Complete your seller profile</h2>
              </div>
              <Link to="/account" className={styles.surfaceLink}>
                Back to account <ChevronRight size={16} />
              </Link>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.grid}>
                <label>
                  Store name
                  <input
                    value={form.storeName}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        storeName: event.target.value,
                      }))
                    }
                    required
                  />
                </label>

                <label>
                  Business type
                  <select
                    value={form.businessType}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        businessType: event.target.value,
                      }))
                    }
                  >
                    <option value="">Select type</option>
                    <option value="Individual">Individual</option>
                    <option value="Registered business">Registered business</option>
                    <option value="Partnership">Partnership</option>
                  </select>
                </label>

                <label>
                  Phone number
                  <input
                    value={form.phone}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  Country
                  <input
                    value={form.country}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        country: event.target.value,
                      }))
                    }
                  />
                </label>

                <label className={styles.spanTwo}>
                  Business address
                  <input
                    value={form.address}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        address: event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  Logo URL
                  <input
                    value={form.logoUrl}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        logoUrl: event.target.value,
                      }))
                    }
                    placeholder="https://..."
                  />
                </label>

                <label>
                  Preferred currency
                  <select
                    value={form.preferredCurrency}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        preferredCurrency: event.target.value,
                      }))
                    }
                  >
                    <option value="USD">USD</option>
                    <option value="NGN">NGN</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </label>

                <label>
                  Marketplace region
                  <select
                    value={form.regionId}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        regionId: event.target.value,
                      }))
                    }
                  >
                    <option value="">Select region</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Categories
                  <input
                    value={form.categories}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        categories: event.target.value,
                      }))
                    }
                    placeholder="Beauty, Electronics, Decor"
                  />
                </label>

                <label className={styles.spanTwo}>
                  Store description
                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    rows={5}
                  />
                </label>
              </div>

              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={form.termsAccepted}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      termsAccepted: event.target.checked,
                    }))
                  }
                />
                <span>
                  I confirm this store information is accurate and I agree to the
                  seller terms required before listing products.
                </span>
              </label>

              {error ? <p className={styles.error}>{error}</p> : null}
              {success ? <p className={styles.success}>{success}</p> : null}

              <div className={styles.formActions}>
                <button type="submit" className={styles.primaryBtn} disabled={saving}>
                  {saving ? "Saving..." : "Save seller profile"}
                </button>
                <p className={styles.helperText}>
                  Product uploads unlock only when your onboarding score reaches 100.
                </p>
              </div>
            </form>
          </section>
        </div>

        <div className={styles.content}>
          <section className={styles.formCard}>
            <div className={styles.cardHead}>
              <div>
                <p className={styles.cardKicker}>Product composer</p>
                <h2>Create your first draft</h2>
              </div>
              <span
                className={`${styles.lockState} ${
                  uploadsUnlocked ? styles.lockStateReady : styles.lockStateLocked
                }`}
              >
                {uploadsUnlocked ? "Uploads unlocked" : "Finish onboarding first"}
              </span>
            </div>

            <form className={styles.form} onSubmit={handleCreateProduct}>
              <div className={styles.grid}>
                <label>
                  Product title
                  <input
                    value={productForm.title}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    disabled={!uploadsUnlocked}
                    required
                  />
                </label>

                <label>
                  Product category
                  <div className={styles.categoryPicker}>
                    <input
                      value={categoryQuery}
                      onFocus={() => setCategoryPickerOpen(true)}
                      onChange={(event) => {
                        const value = event.target.value;
                        setCategoryQuery(value);
                        setCategoryPickerOpen(true);
                        const exactMatch = catalogCategories.find(
                          (item) =>
                            item.name.toLowerCase() === value.trim().toLowerCase() ||
                            item.slug.toLowerCase() === value.trim().toLowerCase(),
                        );
                        setProductForm((current) => ({
                          ...current,
                          categorySlug: exactMatch?.slug || "",
                        }));
                      }}
                      onBlur={() => {
                        window.setTimeout(() => setCategoryPickerOpen(false), 120);
                      }}
                      placeholder="Type to search categories"
                      disabled={!uploadsUnlocked}
                      required
                    />
                    {categoryPickerOpen && filteredCategoryOptions.length > 0 ? (
                      <div className={styles.categoryMenu}>
                        {filteredCategoryOptions.map((category) => (
                          <button
                            key={category.slug}
                            type="button"
                            className={styles.categoryOption}
                            onMouseDown={(event) => {
                              event.preventDefault();
                              setCategoryQuery(category.name);
                              setProductForm((current) => ({
                                ...current,
                                categorySlug: category.slug,
                              }));
                              setCategoryPickerOpen(false);
                            }}
                          >
                            <span className={styles.categoryOptionName}>
                              {category.name}
                            </span>
                            <span className={styles.categoryOptionSlug}>
                              {category.slug}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </label>

                <label>
                  Price
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={productForm.price}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        price: event.target.value,
                      }))
                    }
                    disabled={!uploadsUnlocked}
                    required
                  />
                </label>

                <label>
                  Currency
                  <select
                    value={productForm.currency}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        currency: event.target.value,
                      }))
                    }
                    disabled={!uploadsUnlocked}
                  >
                    <option value="USD">USD</option>
                    <option value="NGN">NGN</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </label>

                <label>
                  Region
                  <select
                    value={productForm.regionId}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        regionId: event.target.value,
                      }))
                    }
                    disabled={!uploadsUnlocked}
                  >
                    <option value="">Select region</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={styles.spanTwo}>
                  Product description
                  <textarea
                    rows={5}
                    value={productForm.description}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    disabled={!uploadsUnlocked}
                  />
                </label>

                <label className={styles.spanTwo}>
                  Image URLs
                  <input
                    value={productForm.images}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        images: event.target.value,
                      }))
                    }
                    placeholder="https://img1.png, https://img2.png"
                    disabled={!uploadsUnlocked}
                  />
                </label>
              </div>

              {productError ? <p className={styles.error}>{productError}</p> : null}
              {productSuccess ? (
                <p className={styles.success}>{productSuccess}</p>
              ) : null}

              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={styles.primaryBtn}
                  disabled={productSaving || !uploadsUnlocked}
                >
                  {productSaving ? "Creating..." : "Create draft product"}
                </button>
                <p className={styles.helperText}>
                  New products start as drafts. Publishing can happen after review
                  from your side, and later from admin tools.
                </p>
              </div>
            </form>
          </section>

          <section className={styles.checklistCard}>
            <div className={styles.cardHead}>
              <div>
                <p className={styles.cardKicker}>Product inventory</p>
                <h2>Your listings</h2>
              </div>
              <span className={styles.countPill}>{products.length}</span>
            </div>

            {products.length ? (
              <div className={styles.productList}>
                {products.map((product) => (
                  <article key={product.id} className={styles.productCard}>
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
                    <div className={styles.productHead}>
                      <div>
                        <p className={styles.productTitle}>{product.title}</p>
                        <p className={styles.productMeta}>
                          {product.currency} {product.price} •{" "}
                          {product.region?.name || "No region"}
                        </p>
                      </div>
                      <span
                        className={`${styles.statusBadge} ${
                          product.status === "PUBLISHED"
                            ? styles.statusPublished
                            : product.status === "PENDING_APPROVAL"
                              ? styles.statusPending
                            : product.status === "REJECTED"
                              ? styles.statusRejected
                            : product.status === "ARCHIVED"
                              ? styles.statusArchived
                              : styles.statusDraft
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>
                    <p className={styles.productMeta}>
                      {product.description || "No description added yet."}
                    </p>
                    {product.status === "REJECTED" && product.adminNotes ? (
                      <div className={styles.reviewNote}>
                        <p className={styles.reviewNoteTitle}>
                          Admin feedback
                        </p>
                        <p className={styles.reviewNoteBody}>{product.adminNotes}</p>
                        <p className={styles.reviewNoteHint}>
                          Update the product, then submit it again for review.
                        </p>
                      </div>
                    ) : null}
                    <div className={styles.productActions}>
                      <button
                        type="button"
                        className={styles.secondaryBtn}
                        disabled={
                          productBusyId === product.id ||
                          product.status === "PUBLISHED" ||
                          product.status === "PENDING_APPROVAL"
                        }
                        onClick={() => handlePublishProduct(product.id)}
                      >
                        <Send size={16} />{" "}
                        {productBusyId === product.id
                          ? "Working..."
                          : product.status === "PUBLISHED"
                            ? "Approved"
                            : product.status === "PENDING_APPROVAL"
                              ? "In review"
                              : product.status === "REJECTED"
                                ? "Resubmit for review"
                                : "Submit for review"}
                      </button>
                      <button
                        type="button"
                        className={styles.secondaryBtn}
                        disabled={
                          productBusyId === product.id ||
                          product.status === "ARCHIVED"
                        }
                        onClick={() => handleArchiveProduct(product.id)}
                      >
                        <PencilLine size={16} /> Archive
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className={styles.helperText}>
                No products yet. Complete onboarding, then create your first draft.
              </p>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
