import express from "express";
import prisma from "../db.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate, requireRole("ADMIN"));

router.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return res.json(users);
});

router.get("/products", async (_req, res) => {
  const products = await prisma.product.findMany({
    include: { seller: true, region: true },
    orderBy: { createdAt: "desc" },
  });
  return res.json(products);
});

router.patch("/products/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const updated = await prisma.product.update({
    where: { id },
    data: { status },
  });

  return res.json(updated);
});

router.get("/regions", async (_req, res) => {
  const regions = await prisma.region.findMany({
    orderBy: { name: "asc" },
  });
  return res.json(regions);
});

router.post("/regions", async (req, res) => {
  const { name, code } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Region name is required" });
  }

  const region = await prisma.region.create({
    data: { name, code },
  });

  return res.status(201).json(region);
});

export default router;
