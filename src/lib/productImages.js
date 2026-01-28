function normalizeUrl(url) {
  return String(url || "").replace(/^http:\/\//, "https://").trim();
}

export function getProductImage(product) {
  if (!product) return "";
  const images = Array.isArray(product.images) ? product.images : [];
  for (const img of images) {
    const normalized = normalizeUrl(img);
    if (normalized) return normalized;
  }
  const fallback = normalizeUrl(product.thumbnail || product.imgUrl);
  return fallback;
}

