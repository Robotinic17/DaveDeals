function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function toSlug(value) {
  return normalizeText(value).replace(/\s+/g, "-");
}

export const CATEGORY_OVERRIDES = {
  fashion: "women-s-clothing",
  "education product": "science-education-supplies",
  "frozen food": "kitchen-and-dining",
  beverages: "kitchen-and-dining",
  "organic grocery": "health-and-household",
  "office supplies": "stationery-and-gift-wrapping-supplies",
  "beauty products": "beauty-and-personal-care",
  books: "books",
  "electronics gadget": "computers-and-tablets",
  electronics: "computers-and-tablets",
  "travel accessories": "travel-duffel-bags",
  travel: "travel-duffel-bags",
  fitness: "sports-and-fitness",
  sneakers: "men-s-shoes",
  toys: "toys-and-games",
  furniture: "furniture",
};

export function buildCategoryIndex(categories) {
  const bySlug = new Map();
  const byName = new Map();
  const list = Array.isArray(categories) ? categories : [];

  for (const category of list) {
    if (!category) continue;
    const slug = String(category.slug || "");
    if (slug) bySlug.set(slug, category);

    const nameKey = normalizeText(category.name);
    if (nameKey) byName.set(nameKey, category);
  }

  return { bySlug, byName, list };
}

export function resolveCategorySlug({ slug, name }, categories, overrides = {}) {
  const index = buildCategoryIndex(categories);
  const slugKey = String(slug || "");

  const overrideKey = normalizeText(slugKey || name);
  const overrideSlug = overrides[overrideKey];
  if (overrideSlug && index.bySlug.has(overrideSlug)) return overrideSlug;

  if (slugKey && index.bySlug.has(slugKey)) return slugKey;

  const nameKey = normalizeText(name);
  if (nameKey && index.byName.has(nameKey)) {
    return index.byName.get(nameKey).slug;
  }

  const derived = toSlug(name);
  if (derived && index.bySlug.has(derived)) return derived;

  // Fuzzy match: score by token overlap against slug + name text
  const tokens = nameKey.split(/\s+/).filter(Boolean);
  if (!tokens.length) return slugKey || null;

  let best = null;
  let bestScore = 0;
  for (const category of index.list) {
    const hay = `${normalizeText(category.name)} ${normalizeText(
      category.slug,
    )}`;
    let score = 0;
    for (const token of tokens) {
      if (hay.includes(token)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = category.slug;
    }
  }

  return best || slugKey || null;
}
