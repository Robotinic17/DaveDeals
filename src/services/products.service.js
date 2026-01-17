const BASE_URL = "https://dummyjson.com";

export async function getCategories() {
  const res = await fetch(`${BASE_URL}/products/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function getProductsByCategory(category) {
  const res = await fetch(
    `${BASE_URL}/products/category/${encodeURIComponent(category)}`
  );
  if (!res.ok) throw new Error("Failed to fetch category products");
  return res.json();
}
