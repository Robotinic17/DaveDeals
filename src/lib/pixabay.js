const API_KEY = import.meta.env.VITE_PIXABAY_KEY;
const CACHE_KEY = "pixabay-category-images-v1";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;

function readCache() {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function writeCache(cache) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    // ignore write errors
  }
}

async function fetchImage(query) {
  if (!API_KEY) return null;
  const endpoint = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(
    query
  )}&image_type=photo&orientation=horizontal&per_page=3&safesearch=true`;
  const res = await fetch(endpoint);
  if (!res.ok) return null;
  const data = await res.json();
  const hit = data?.hits?.[0];
  if (!hit) return null;
  return {
    id: hit.id,
    url: hit.webformatURL || hit.previewURL,
    user: hit.user || "Pixabay",
    pageUrl: hit.pageURL || "https://pixabay.com",
    cachedAt: Date.now(),
  };
}

export async function getCategoryImage(name, slug) {
  const cache = readCache();
  const cached = cache[slug];
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return cached;
  }

  const query = `${name || slug} category`;
  const image = await fetchImage(query);
  if (!image) return null;
  const next = { ...cache, [slug]: image };
  writeCache(next);
  return image;
}
