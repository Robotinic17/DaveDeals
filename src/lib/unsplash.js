const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const CACHE_KEY = "unsplash-category-images-v1";
const DOWNLOAD_KEY = "unsplash-category-downloads-v1";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

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
    // ignore write errors (private mode, etc.)
  }
}

function readDownloads() {
  if (typeof sessionStorage === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(DOWNLOAD_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function writeDownloads(cache) {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(DOWNLOAD_KEY, JSON.stringify(cache));
  } catch (e) {
    // ignore write errors
  }
}

function withUtm(url) {
  const joiner = url.includes("?") ? "&" : "?";
  return `${url}${joiner}utm_source=DaveDeals&utm_medium=referral`;
}

async function fetchImage(query) {
  if (!ACCESS_KEY) {
    console.warn("Unsplash access key not configured");
    return null;
  }

  const endpoint = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query,
  )}&per_page=1&orientation=squarish&client_id=${ACCESS_KEY}`;

  try {
    const res = await fetch(endpoint);
    if (!res.ok) return null;

    const data = await res.json();
    const photo = data?.results?.[0];
    if (!photo) return null;

    return {
      id: photo.id,
      url: photo.urls?.small || photo.urls?.regular,
      name: photo.user?.name || "Unknown",
      userLink: withUtm(photo.user?.links?.html || "https://unsplash.com"),
      unsplashLink: withUtm("https://unsplash.com"),
      downloadLocation: photo.links?.download_location || null,
      cachedAt: Date.now(),
    };
  } catch (error) {
    console.error("Unsplash fetch error:", error);
    return null;
  }
}

export async function getCategoryImage(name, slug) {
  const cache = readCache();
  const cached = cache[slug];

  // Return cached if still valid
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return cached;
  }

  const query = `${name || slug} product category`;
  const image = await fetchImage(query);

  if (!image) return null;

  const next = { ...cache, [slug]: image };
  writeCache(next);

  return image;
}

export function triggerDownloadOnce(image) {
  if (!ACCESS_KEY || !image?.downloadLocation || !image?.id) return;

  const downloads = readDownloads();
  if (downloads[image.id]) return; // Already triggered

  downloads[image.id] = true;
  writeDownloads(downloads);

  // Fixed: Added parentheses instead of backticks
  fetch(`${image.downloadLocation}?client_id=${ACCESS_KEY}`).catch(() => {
    // Silent fail - download tracking is non-critical
  });
}
