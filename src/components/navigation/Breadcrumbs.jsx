import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import styles from "./Breadcrumbs.module.css";
import { getCategoryBySlug, getProductById } from "../../lib/catalog";

export default function Breadcrumbs() {
  const location = useLocation();
  const { slug, id } = useParams();
  const [trail, setTrail] = useState([]);

  const pathname = useMemo(() => location.pathname, [location.pathname]);

  useEffect(() => {
    let active = true;

    async function build() {
      const items = [{ label: "Home", to: "/" }];

      if (pathname.startsWith("/categories")) {
        items.push({ label: "Categories", to: "/categories" });
      } else if (pathname.startsWith("/whats-new")) {
        items.push({ label: "What's New", to: "/whats-new" });
      } else if (pathname.startsWith("/deals")) {
        items.push({ label: "Deals", to: "/deals" });
      } else if (pathname.startsWith("/delivery")) {
        items.push({ label: "Delivery", to: "/delivery" });
      } else if (pathname.startsWith("/c/") && slug) {
        const cat = await getCategoryBySlug(slug);
        items.push({ label: "Categories", to: "/categories" });
        items.push({
          label: cat?.name || slug,
          to: `/c/${slug}`,
        });
      } else if (pathname.startsWith("/p/") && id) {
        const product = await getProductById(id);
        if (product?.categorySlug) {
          const cat = await getCategoryBySlug(product.categorySlug);
          items.push({
            label: cat?.name || product.categorySlug,
            to: `/c/${product.categorySlug}`,
          });
        }
        items.push({
          label: product?.title || id,
          to: `/p/${id}`,
        });
      }

      if (!active) return;
      setTrail(items);
    }

    build();

    return () => {
      active = false;
    };
  }, [pathname, slug, id]);

  if (pathname === "/" || trail.length <= 1) return null;

  return (
    <div className={styles.wrap}>
      <nav className={styles.nav} aria-label="Breadcrumb">
        {trail.map((item, idx) => (
          <span key={item.to} className={styles.item}>
            {idx < trail.length - 1 ? (
              <Link to={item.to} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              <span className={styles.current}>{item.label}</span>
            )}
            {idx < trail.length - 1 && <span className={styles.sep}>/</span>}
          </span>
        ))}
      </nav>
    </div>
  );
}
