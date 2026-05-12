const DEFAULT_USD_TO_NGN = 1600;
const RATE_STORAGE_KEY = "davedeals_usd_to_ngn_rate";

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function getUsdToNgnRate() {
  if (typeof window === "undefined") return DEFAULT_USD_TO_NGN;

  const storedRate = toNumber(window.localStorage.getItem(RATE_STORAGE_KEY), 0);
  return storedRate > 0 ? storedRate : DEFAULT_USD_TO_NGN;
}

export function setUsdToNgnRate(rate) {
  if (typeof window === "undefined") return;
  const normalizedRate = toNumber(rate, 0);
  if (normalizedRate <= 0) return;
  window.localStorage.setItem(RATE_STORAGE_KEY, String(normalizedRate));
}

export function toNairaAmount(value, currency = "USD") {
  const amount = toNumber(value, NaN);
  if (!Number.isFinite(amount)) return NaN;

  if (String(currency || "USD").toUpperCase() === "NGN") return amount;
  return amount * getUsdToNgnRate();
}

export function formatNaira(value, fallback = "Price N/A", currency = "USD") {
  const amount = toNairaAmount(value, currency);
  if (!Number.isFinite(amount)) return fallback;

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(amount);
}
