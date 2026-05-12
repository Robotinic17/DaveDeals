import { toNairaAmount } from "./currency";

const CART_KEY = "davedeals_cart";

function isBrowser() {
  return typeof window !== "undefined";
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function loadCart() {
  if (!isBrowser()) return [];

  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Migrate old/non-NGN cart entries so totals are consistent.
    const migrated = parsed.map((item) => ({
      ...item,
      price: toNairaAmount(item?.price, item?.currency || "USD"),
      currency: "NGN",
    }));
    return migrated;
  } catch {
    return [];
  }
}

export function saveCart(items) {
  if (!isBrowser()) return;
  const normalized = Array.isArray(items) ? items : [];
  localStorage.setItem(CART_KEY, JSON.stringify(normalized));
}

export function addToCart(item, quantity = 1) {
  const normalizedQuantity = Math.max(1, Math.trunc(toNumber(quantity, 1)));
  const id = String(item?.id || item?.asin || "").trim();
  if (!id) return loadCart();

  const next = [...loadCart()];
  const existingIndex = next.findIndex((entry) => String(entry.id) === id);

  if (existingIndex >= 0) {
    next[existingIndex] = {
      ...next[existingIndex],
      quantity: Math.max(
        1,
        toNumber(next[existingIndex].quantity, 1) + normalizedQuantity,
      ),
    };
  } else {
    next.push({
      id,
      title: String(item?.title || "Product"),
      price: toNairaAmount(item?.price, item?.currency || "USD"),
      currency: "NGN",
      thumbnail: String(item?.thumbnail || item?.imgUrl || ""),
      quantity: normalizedQuantity,
    });
  }

  saveCart(next);
  return next;
}

export function updateCartItemQuantity(id, quantity) {
  const key = String(id || "").trim();
  if (!key) return loadCart();

  const normalizedQuantity = Math.max(1, Math.trunc(toNumber(quantity, 1)));
  const next = loadCart().map((item) =>
    String(item.id) === key ? { ...item, quantity: normalizedQuantity } : item,
  );
  saveCart(next);
  return next;
}

export function removeFromCart(id) {
  const key = String(id || "").trim();
  const next = loadCart().filter((item) => String(item.id) !== key);
  saveCart(next);
  return next;
}

export function isInCart(id) {
  const key = String(id || "").trim();
  if (!key) return false;
  const cart = loadCart();
  return cart.some((item) => String(item.id) === key);
}

export function clearCart() {
  saveCart([]);
}

export function getCartTotals(items = loadCart()) {
  const normalized = Array.isArray(items) ? items : [];

  return normalized.reduce(
    (totals, item) => {
      const price = toNumber(item?.price, 0);
      const quantity = Math.max(1, Math.trunc(toNumber(item?.quantity, 1)));
      totals.count += quantity;
      totals.subtotal += price * quantity;
      return totals;
    },
    { count: 0, subtotal: 0 },
  );
}
