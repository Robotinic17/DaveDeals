import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import prisma from "./db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import adminRoutes from "./routes/admin.js";

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

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

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);

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
        console.error(`Port ${port} is already in use. Stop the other process and retry.`);
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
