import express from "express";
import prisma from "../db.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { region, status } = req.query;

  const products = await prisma.product.findMany({
    where: {
      status: status ? String(status) : "PUBLISHED",
      region: region ? { name: String(region) } : undefined,
    },
    include: {
      seller: true,
      region: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return res.json(products);
});

router.post("/", authenticate, requireRole("SELLER", "ADMIN"), async (req, res) => {
  const { title, description, price, currency, regionId, images } = req.body;

  if (!title || !price) {
    return res.status(400).json({ message: "Title and price are required" });
  }

  const seller = await prisma.seller.findUnique({
    where: { userId: req.user.id },
  });

  if (!seller) {
    return res.status(403).json({ message: "Seller profile not found" });
  }

  const product = await prisma.product.create({
    data: {
      title,
      description,
      price: Number(price),
      currency: currency || "USD",
      regionId: regionId || seller.regionId,
      images: Array.isArray(images) ? images : [],
      sellerId: seller.id,
      status: "DRAFT",
    },
  });

  return res.status(201).json(product);
});

router.patch("/:id", authenticate, requireRole("SELLER", "ADMIN"), async (req, res) => {
  const { id } = req.params;
  const { title, description, price, currency, regionId, images, status } = req.body;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (req.user.role !== "ADMIN") {
    const seller = await prisma.seller.findUnique({ where: { userId: req.user.id } });
    if (!seller || seller.id !== product.sellerId) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      title,
      description,
      price: price !== undefined ? Number(price) : undefined,
      currency,
      regionId,
      images: Array.isArray(images) ? images : undefined,
      status,
    },
  });

  return res.json(updated);
});

export default router;
