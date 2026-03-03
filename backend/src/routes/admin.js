import express from "express";
import prisma from "../db.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { buildSellerOnboarding } from "../lib/sellerOnboarding.js";

const router = express.Router();

router.use(authenticate, requireRole("ADMIN"));

router.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return res.json(users);
});

router.get("/overview", async (_req, res) => {
  const [users, sellers, applications, products, regions, pendingProducts] = await Promise.all([
    prisma.user.count(),
    prisma.seller.count(),
    prisma.sellerApplication.count({ where: { status: "PENDING" } }),
    prisma.product.count(),
    prisma.region.count(),
    prisma.product.count({ where: { status: "PENDING_APPROVAL" } }),
  ]);

  return res.json({
    users,
    sellers,
    pendingSellerApplications: applications,
    pendingProducts,
    products,
    regions,
  });
});

router.get("/seller-applications", async (_req, res) => {
  const applications = await prisma.sellerApplication.findMany({
    include: {
      user: {
        select: { id: true, email: true, name: true, role: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json(applications);
});

router.get("/sellers", async (_req, res) => {
  const sellers = await prisma.seller.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      },
      region: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json(
    sellers.map((seller) => ({
      ...seller,
      onboarding: buildSellerOnboarding(seller),
    })),
  );
});

router.post("/seller-applications/:id/approve", async (req, res) => {
  const { id } = req.params;

  const application = await prisma.sellerApplication.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!application) {
    return res.status(404).json({ message: "Seller application not found" });
  }

  if (!application.userId || !application.user) {
    return res.status(400).json({
      message: "This application is not linked to a buyer account",
    });
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: application.userId },
      data: {
        role: "SELLER",
        name: application.name,
      },
    });

    await tx.seller.upsert({
      where: { userId: application.userId },
      update: {},
      create: {
        userId: application.userId,
      },
    });

    await tx.sellerApplication.update({
      where: { id: application.id },
      data: {
        status: "APPROVED",
        reviewedAt: new Date(),
      },
    });
  });

  return res.json({ message: "Seller approved successfully" });
});

router.post("/seller-applications/:id/reject", async (req, res) => {
  const { id } = req.params;
  const reason = String(req.body?.reason || "").trim();

  if (!reason) {
    return res.status(400).json({ message: "Rejection reason is required" });
  }

  const application = await prisma.sellerApplication.findUnique({
    where: { id },
  });

  if (!application) {
    return res.status(404).json({ message: "Seller application not found" });
  }

  const updated = await prisma.sellerApplication.update({
    where: { id },
    data: {
      status: "REJECTED",
      adminNotes: reason,
      reviewedAt: new Date(),
    },
  });

  return res.json({
    message: "Seller application rejected",
    application: updated,
  });
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
  const { status, reason } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  if (status === "REJECTED" && !String(reason || "").trim()) {
    return res.status(400).json({ message: "Rejection reason is required" });
  }

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Product not found" });
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      status,
      adminNotes: status === "REJECTED" ? String(reason).trim() : null,
      reviewedAt:
        status === "REJECTED" || status === "PUBLISHED" ? new Date() : null,
    },
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
