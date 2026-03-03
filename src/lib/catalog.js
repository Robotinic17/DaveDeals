import { CATEGORY_OVERRIDES, resolveCategorySlug } from "./categoryResolver";

const API_ROOT = (
  import.meta.env.VITE_API_URL || "http://localhost:4000/api"
).replace(/\/$/, "");
const CACHE_TTL_MS = 15000;

let cache = null;
let cacheExpiresAt = 0;

function normalizeUrl(url) {
  return String(url || "").replace(/^http:\/\//, "https://").trim();
}

function normalizeLiveProduct(product, categories) {
  if (!product?.id) return null;

  const categoryName = product.category || "Marketplace";
  const categorySlug =
    resolveCategorySlug(
      { slug: product.categorySlug, name: categoryName },
      categories,
      CATEGORY_OVERRIDES,
    ) || product.categorySlug || "";

  return {
    ...product,
    id: product.id,
    asin: product.asin || product.id,
    title: product.title || "Product",
    description: product.description || "",
    price: Number(product.price || 0),
    currency: product.currency || "USD",
    category: categoryName,
    categorySlug,
    rating: Number(product.rating || 0),
    reviewsCount: Number(product.reviewsCount || 0),
    thumbnail: normalizeUrl(
      product.images?.[0] || product.thumbnail || product.imgUrl,
    ),
    imgUrl: normalizeUrl(product.images?.[0] || product.imgUrl || product.thumbnail),
    images: Array.isArray(product.images)
      ? product.images.map(normalizeUrl).filter(Boolean)
      : [],
    brand: product.seller?.storeName || product.brand || "",
    sellerName: product.seller?.storeName || "",
    regionName: product.region?.name || "",
    live: true,
  };
}

async function fetchLiveProducts(categories) {
  try {
    const response = await fetch(`${API_ROOT}/products`);
    if (!response.ok) throw new Error("Failed to load live products");
    const data = await response.json();
    if (!Array.isArray(data)) return [];
    return data
      .map((product) => normalizeLiveProduct(product, categories))
      .filter(Boolean);
  } catch {
    return [];
  }
}

async function loadCatalog() {
  const now = Date.now();
  if (cache && cacheExpiresAt > now) return cache;

  const [productsRes, categoriesRes, marketplaceRes] = await Promise.all([
    fetch("/data/products.json"),
    fetch("/data/categories.json"),
    fetch("/data/marketplace-categories.json"),
  ]);

  const staticProducts = await productsRes.json();
  const categories = await categoriesRes.json();
  const marketplaceCategories = await marketplaceRes.json();
  const liveProducts = await fetchLiveProducts(marketplaceCategories);

  const productMap = new Map();
  for (const product of Array.isArray(staticProducts) ? staticProducts : []) {
    const key = String(product?.id || product?.asin || "");
    if (!key) continue;
    productMap.set(key, product);
  }

  for (const product of liveProducts) {
    const key = String(product.id || product.asin || "");
    if (!key) continue;
    productMap.set(key, product);
  }

  const normalizedMarketplace = Array.isArray(marketplaceCategories)
    ? marketplaceCategories
    : [];
  const allCategories = new Map();

  for (const category of Array.isArray(categories) ? categories : []) {
    if (!category?.slug) continue;
    allCategories.set(category.slug, category);
  }

  for (const category of normalizedMarketplace) {
    if (!category?.slug) continue;
    allCategories.set(category.slug, category);
  }

  const finalCategories = [...allCategories.values()];
  const categoriesBySlug = new Map(finalCategories.map((c) => [c.slug, c]));

  cache = {
    products: [...productMap.values()],
    categories: finalCategories,
    categoriesBySlug,
    marketplaceCategories: normalizedMarketplace,
  };
  cacheExpiresAt = now + CACHE_TTL_MS;
  return cache;
}

export async function getAllCategories() {
  const { categories } = await loadCatalog();
  return categories;
}

export async function getMarketplaceCategories() {
  const { marketplaceCategories } = await loadCatalog();
  return marketplaceCategories;
}

export async function getAllProducts() {
  const { products } = await loadCatalog();
  return products;
}

export async function getCategoryBySlug(slug) {
  const { categoriesBySlug } = await loadCatalog();
  return categoriesBySlug.get(slug) || null;
}

export async function getProductsByCategorySlug(slug) {
  const { products } = await loadCatalog();
  return products.filter((p) => p.categorySlug === slug);
}

export async function getProductById(id) {
  const { products } = await loadCatalog();
  const key = String(id);
  return (
    products.find((p) => String(p.id) === key || String(p.asin) === key) || null
  );
}

export async function getPopulatedCategories(limit = Infinity) {
  const { products, categoriesBySlug } = await loadCatalog();
  const counts = new Map();

  for (const product of products) {
    const slug = String(product?.categorySlug || "").trim();
    if (!slug) continue;

    const category =
      categoriesBySlug.get(slug) || {
        slug,
        name: product.category || slug,
      };

    const current = counts.get(slug) || {
      ...category,
      count: 0,
    };

    current.count += 1;
    counts.set(slug, current);
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count || String(a.name).localeCompare(String(b.name)))
    .slice(0, limit);
}

export function invalidateCatalogCache() {
  cache = null;
  cacheExpiresAt = 0;
}
