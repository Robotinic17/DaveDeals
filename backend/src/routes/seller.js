import express from "express";
import prisma from "../db.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { buildSellerOnboarding } from "../lib/sellerOnboarding.js";

const router = express.Router();

function normalizeCategories(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || "").trim())
      .filter(Boolean)
      .slice(0, 8);
  }

  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}

router.use(authenticate, requireRole("SELLER", "ADMIN"));

router.get("/products", async (req, res) => {
  const seller = await prisma.seller.findUnique({
    where: { userId: req.user.id },
  });

  if (!seller) {
    return res.status(404).json({ message: "Seller profile not found" });
  }

  const products = await prisma.product.findMany({
    where: { sellerId: seller.id },
    include: {
      region: {
        select: { id: true, name: true, code: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json(products);
});

router.get("/me", async (req, res) => {
  const [seller, regions] = await Promise.all([
    prisma.seller.findUnique({
      where: { userId: req.user.id },
      include: {
        region: {
          select: { id: true, name: true, code: true },
        },
        user: {
          select: { id: true, email: true, name: true, role: true },
        },
      },
    }),
    prisma.region.findMany({
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!seller) {
    return res.status(404).json({ message: "Seller profile not found" });
  }

  return res.json({
    seller,
    regions,
    onboarding: buildSellerOnboarding(seller),
  });
});

router.patch("/me", async (req, res) => {
  const existing = await prisma.seller.findUnique({
    where: { userId: req.user.id },
  });

  if (!existing) {
    return res.status(404).json({ message: "Seller profile not found" });
  }

  const categories = normalizeCategories(req.body.categories);
  const data = {
    storeName: req.body.storeName?.trim(),
    businessType: req.body.businessType?.trim(),
    phone: req.body.phone?.trim(),
    country: req.body.country?.trim(),
    address: req.body.address?.trim(),
    logoUrl: req.body.logoUrl?.trim(),
    description: req.body.description?.trim(),
    categories,
    preferredCurrency: req.body.preferredCurrency?.trim() || "USD",
    regionId: req.body.regionId || null,
    termsAccepted: Boolean(req.body.termsAccepted),
  };

  const previewSeller = { ...existing, ...data };
  const onboarding = buildSellerOnboarding(previewSeller);

  const seller = await prisma.seller.update({
    where: { userId: req.user.id },
    data: {
      ...data,
      onboardingCompletedAt: onboarding.isComplete ? new Date() : null,
    },
    include: {
      region: {
        select: { id: true, name: true, code: true },
      },
      user: {
        select: { id: true, email: true, name: true, role: true },
      },
    },
  });

  return res.json({
    seller,
    regions: await prisma.region.findMany({
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" },
    }),
    onboarding: buildSellerOnboarding(seller),
  });
});

export default router;
