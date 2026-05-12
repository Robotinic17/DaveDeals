import express from "express";
import prisma from "../db.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    const application = await prisma.sellerApplication.findFirst({
      where: {
        OR: [
          { userId: req.user.id },
          { email: String(req.user.email || "").toLowerCase() },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json(application || null);
  }),
);

router.post(
  "/",
  authenticate,
  requireRole("BUYER"),
  asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "BUYER") {
      return res
        .status(400)
        .json({ message: "Only buyers can apply to become sellers" });
    }

    const applicationName = String(name || user.name || "").trim();
    const applicationEmail = String(email || user.email || "")
      .toLowerCase()
      .trim();

    if (!applicationName || !applicationEmail) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    if (applicationEmail !== user.email.toLowerCase()) {
      return res
        .status(400)
        .json({ message: "Please use the email attached to your account" });
    }

    const existingPending = await prisma.sellerApplication.findFirst({
      where: {
        OR: [{ userId: user.id }, { email: applicationEmail }],
        status: "PENDING",
      },
    });

    if (existingPending) {
      return res.status(409).json({
        message: "You already have a pending seller application",
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { name: applicationName },
    });

    const application = await prisma.sellerApplication.create({
      data: {
        userId: user.id,
        email: applicationEmail,
        name: applicationName,
      },
    });

    return res.status(201).json({
      message: "Application submitted. Admin review is now pending.",
      application,
    });
  }),
);

export default router;
