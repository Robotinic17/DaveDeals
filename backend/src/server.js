import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import bcrypt from "bcrypt";
import prisma from "./db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import adminRoutes from "./routes/admin.js";
import sellerApplicationRoutes from "./routes/sellerApplications.js";
import sellerRoutes from "./routes/seller.js";
import orderRoutes from "./routes/orders.js";

const app = express();
const port = Number(process.env.PORT) || 4000;

// CORS configuration - restrict to frontend origin
const corsOptions = {
  origin:
    process.env.ALLOWED_ORIGIN ||
    (process.env.NODE_ENV === "production"
      ? "https://davedeals.com"
      : "http://localhost:5173"),
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Rate limiting - strict for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: "Too many login/signup attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limiter for other endpoints
const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Lenient rate limiter for product reads (read-only operations)
const productLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200, // Allow many product fetch requests
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/", (_req, res) => {
  res.json({
    service: "DaveDeals API",
    status: "ok",
    docs: "/api/health",
  });
});

app.get("/.well-known/appspecific/com.chrome.devtools.json", (_req, res) => {
  res.status(204).end();
});

app.use("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Apply rate limiting to auth routes (stricter limits)
app.use("/api/auth", authLimiter, authRoutes);

// Apply general rate limiting to other routes
app.use("/api/seller-applications", generalLimiter, sellerApplicationRoutes);
app.use("/api/seller", generalLimiter, sellerRoutes);
app.use("/api/products", productLimiter, productRoutes);
app.use("/api/admin", generalLimiter, adminRoutes);
app.use("/api/orders", generalLimiter, orderRoutes);

app.use((err, _req, res, _next) => {
  console.error("API error:", err);
  res.status(500).json({ message: "Server error" });
});

async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) return;

  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  const passwordHash = await bcrypt.hash(password, 10);

  if (existing) {
    const matches = await bcrypt.compare(password, existing.passwordHash);
    if (!matches || existing.role !== "ADMIN") {
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          passwordHash,
          role: "ADMIN",
          name: existing.name || "Admin",
        },
      });
      console.log("Admin user synced");
    }
    return;
  }

  await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      role: "ADMIN",
      name: "Admin",
    },
  });
  console.log("Admin user created");
}

let server;
let isShuttingDown = false;

function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`${signal} received, shutting down...`);

  if (!server) {
    prisma.$disconnect().finally(() => process.exit(0));
    return;
  }

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

ensureAdmin()
  .then(() => {
    server = app.listen(port, () => {
      console.log(`API running on http://localhost:${port}`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(
          `Port ${port} is already in use. Stop the other process and retry.`,
        );
      } else {
        console.error("Server failed to start:", err);
      }
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error("Startup failed:", err);
    process.exit(1);
  });
