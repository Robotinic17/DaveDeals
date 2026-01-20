let cache = null;

async function loadCatalog() {
  if (cache) return cache;

  const [productsRes, categoriesRes] = await Promise.all([
    fetch("/data/products.json"),
    fetch("/data/categories.json"),
  ]);

  const products = await productsRes.json();
  const categories = await categoriesRes.json();

  const categoriesBySlug = new Map(categories.map((c) => [c.slug, c]));

  cache = { products, categories, categoriesBySlug };
  return cache;
}

export async function getAllCategories() {
  const { categories } = await loadCatalog();
  return categories;
}

export async function getCategoryBySlug(slug) {
  const { categoriesBySlug } = await loadCatalog();
  return categoriesBySlug.get(slug) || null;
}

export async function getProductsByCategorySlug(slug) {
  const { products } = await loadCatalog();
  return products.filter((p) => p.categorySlug === slug);
}
