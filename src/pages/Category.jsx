import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Category.module.css";
import { getProductsByCategory } from "../services/products.service";

function formatCategoryTitle(slug) {
  if (!slug) return "";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function Category() {
  const { slug } = useParams();
  console.log("params slug:", slug);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);

  const title = useMemo(() => formatCategoryTitle(slug), [slug]);

  useEffect(() => {
    let isActive = true;

    async function load() {
      if (!slug) return;

      setLoading(true);
      setError("");

      try {
        const data = await getProductsByCategory(slug);
        if (!isActive) return;

        setProducts(Array.isArray(data.products) ? data.products : []);
      } catch {
        if (!isActive) return;
        setError("Failed to load products.");
      } finally {
        if (!isActive) return;
        setLoading(false);
      }
    }

    load();

    return () => {
      isActive = false;
    };
  }, [slug]);

  return (
    <section className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>{title}</h1>

        {loading && <p className={styles.muted}>Loading products...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && (
          <div className={styles.grid}>
            {products.map((p) => (
              <div key={p.id} className={styles.card}>
                <img src={p.thumbnail} alt={p.title} className={styles.thumb} />
                <div className={styles.cardBody}>
                  <p className={styles.name}>{p.title}</p>
                  <p className={styles.price}>${p.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
