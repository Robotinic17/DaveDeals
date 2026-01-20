import fs from "fs";
import path from "path";
import csv from "csv-parser";

const RAW_DIR = path.resolve("data_raw");
const OUT_DIR = path.resolve("data_processed");

const CATEGORIES_CSV = path.join(RAW_DIR, "amazon_categories.csv");
const PRODUCTS_CSV = path.join(RAW_DIR, "amazon_products.csv");

const OUT_PRODUCTS = path.join(OUT_DIR, "products.sample.json");
const OUT_CATEGORIES = path.join(OUT_DIR, "categories.json");

const MAX_PER_CATEGORY = 200; // 👈 change to 150 if you want
const MAX_CATEGORIES = 220; // stop after filling this many categories (keeps file size sane)

function slugify(s = "") {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pick(obj, keys) {
  for (const k of keys) if (obj?.[k] != null && obj[k] !== "") return obj[k];
  return null;
}

function toNumber(v) {
  if (v == null) return null;
  const n = Number(String(v).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

async function loadCategories() {
  const map = new Map(); // id -> {id, name, slug}
  await new Promise((resolve, reject) => {
    fs.createReadStream(CATEGORIES_CSV)
      .pipe(csv())
      .on("data", (row) => {
        const id = pick(row, ["id", "category_id", "categoryId"]);
        const name = pick(row, ["name", "category_name", "category", "title"]);
        if (!id || !name) return;
        map.set(String(id), {
          id: String(id),
          name: String(name),
          slug: slugify(name),
        });
      })
      .on("end", resolve)
      .on("error", reject);
  });

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(
    OUT_CATEGORIES,
    JSON.stringify([...map.values()], null, 2),
    "utf8"
  );
  return map;
}

async function buildProducts(categoriesMap) {
  const products = [];
  const perCatCount = new Map(); // slug -> count
  let filledCats = 0;

  function canTake(slug) {
    const current = perCatCount.get(slug) || 0;
    return current < MAX_PER_CATEGORY;
  }

  function take(slug) {
    const current = perCatCount.get(slug) || 0;
    if (current === 0) filledCats++;
    perCatCount.set(slug, current + 1);
  }

  let stream;
  await new Promise((resolve, reject) => {
    stream = fs
      .createReadStream(PRODUCTS_CSV)
      .pipe(csv())
      .on("data", function (row) {
        const categoryId = pick(row, [
          "category_id",
          "categoryId",
          "cat_id",
          "catId",
        ]);
        const cat = categoryId ? categoriesMap.get(String(categoryId)) : null;
        const slug = cat?.slug || "uncategorized";

        // stop when we have enough categories filled
        if (filledCats >= MAX_CATEGORIES) {
          this.destroy();
          return;
        }

        if (!canTake(slug)) return;

        const title = pick(row, [
          "title",
          "name",
          "product_title",
          "productTitle",
        ]);
        if (!title) return;

        const price = toNumber(
          pick(row, ["price", "sale_price", "current_price", "final_price"])
        );
        const rating = toNumber(
          pick(row, ["stars", "rating", "avg_rating", "average_rating"])
        );
        const reviewsCount = toNumber(
          pick(row, ["reviews", "num_reviews", "review_count", "ratings_total"])
        );

        const thumbnail =
          pick(row, [
            "imgUrl",
            "thumbnail",
            "image",
            "img",
            "image_url",
            "imageUrl",
            "product_image",
            "productImage",
          ]) || null;

        products.push({
          id:
            pick(row, ["asin", "id", "product_id"]) ||
            `p_${products.length + 1}`,
          title: String(title),
          price: price ?? null,
          rating: rating ?? null,
          reviewsCount: reviewsCount ?? null,
          category: cat?.name ?? "Uncategorized",
          categorySlug: slug,
          thumbnail,
        });

        take(slug);
      })
      .on("end", resolve)
      .on("error", reject);
  });

  fs.writeFileSync(OUT_PRODUCTS, JSON.stringify(products, null, 2), "utf8");
  console.log(`✅ Wrote ${products.length} products to ${OUT_PRODUCTS}`);
  console.log(`✅ Categories filled: ${filledCats}`);
}

const categoriesMap = await loadCategories();
await buildProducts(categoriesMap);
