import fs from "fs";
import path from "path";
import { createRequire } from "module";

const RAW_DIR = path.resolve("data_raw");
const OUT_DIR = path.resolve("data_processed");

const CATEGORIES_CSV = path.join(RAW_DIR, "amazon_categories.csv");
const PRODUCTS_CSV = path.join(RAW_DIR, "amazon_products.csv");

const OUT_PRODUCTS = path.join(OUT_DIR, "products.sample.json");
const OUT_CATEGORIES = path.join(OUT_DIR, "categories.json");

const MAX_PER_CATEGORY = 200; // change to 150 if you want
const MAX_CATEGORIES = 200; // stop after filling this many categories (keeps file size sane)

const require = createRequire(import.meta.url);
let csv;
try {
  csv = require("csv-parser");
} catch (err) {
  console.error(
    "Missing dependency: csv-parser. Install it with `npm i csv-parser`."
  );
  process.exit(1);
}

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

function ensureFileExists(filePath, label) {
  if (!fs.existsSync(filePath)) {
    console.error(`Missing file: ${label} not found at ${filePath}`);
    process.exit(1);
  }
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
  let catsAtCap = 0;

  function canTake(slug) {
    const current = perCatCount.get(slug) || 0;
    return current < MAX_PER_CATEGORY;
  }

  function take(slug) {
    const current = perCatCount.get(slug) || 0;
    if (current === 0) filledCats++;
    const next = current + 1;
    if (next === MAX_PER_CATEGORY) catsAtCap++;
    perCatCount.set(slug, next);
  }

  await new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(PRODUCTS_CSV);
    const parser = csv();
    let finished = false;
    let stoppedEarly = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      resolve();
    };

    const fail = (err) => {
      if (finished) return;
      finished = true;
      reject(err);
    };

    const stopEarly = () => {
      if (stoppedEarly) return;
      stoppedEarly = true;
      fileStream.destroy();
      parser.destroy();
      finish();
    };

    fileStream.on("error", fail);
    parser.on("error", fail);
    parser.on("end", finish);
    parser.on("close", () => {
      if (stoppedEarly) finish();
    });

    fileStream.pipe(parser).on("data", function (row) {
      const categoryId = pick(row, ["category_id"]);
      const cat = categoryId ? categoriesMap.get(String(categoryId)) : null;
      const slug = cat?.slug || "uncategorized";

      const hasCat = perCatCount.has(slug);
      if (!hasCat && filledCats >= MAX_CATEGORIES) {
        if (catsAtCap >= MAX_CATEGORIES) stopEarly();
        return;
      }

      if (!canTake(slug)) {
        if (catsAtCap >= MAX_CATEGORIES && filledCats >= MAX_CATEGORIES)
          stopEarly();
        return;
      }

      const title = pick(row, ["title"]);
      if (!title) return;

      const price = toNumber(pick(row, ["price"]));
      const rating = toNumber(pick(row, ["stars"]));
      const reviewsCount = toNumber(pick(row, ["reviews"]));
      const thumbnail = pick(row, ["imgUrl"]) || null;

      products.push({
        id: pick(row, ["asin"]) || `p_${products.length + 1}`,
        title: String(title),
        price: price ?? null,
        rating: rating ?? null,
        reviewsCount: reviewsCount ?? null,
        category: cat?.name ?? "Uncategorized",
        categorySlug: slug,
        thumbnail,
      });

      take(slug);

      if (catsAtCap >= MAX_CATEGORIES && filledCats >= MAX_CATEGORIES)
        stopEarly();
    });
  });

  fs.writeFileSync(OUT_PRODUCTS, JSON.stringify(products, null, 2), "utf8");
  console.log(`Wrote ${products.length} products to ${OUT_PRODUCTS}`);
  console.log(`Categories filled: ${filledCats}`);
  console.log(
    `Success: MAX_PER_CATEGORY=${MAX_PER_CATEGORY}, MAX_CATEGORIES=${MAX_CATEGORIES}`
  );
}

ensureFileExists(CATEGORIES_CSV, "Categories CSV");
ensureFileExists(PRODUCTS_CSV, "Products CSV");
const categoriesMap = await loadCategories();
await buildProducts(categoriesMap);
