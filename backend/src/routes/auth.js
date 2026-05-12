import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../db.js";
import { sendPasswordResetEmail } from "../lib/email.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "",
    { expiresIn: "7d" },
  );
}

function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { email, password, name, role } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const safeRole = "BUYER";

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        name,
        role: safeRole,
      },
    });

    const token = signToken(user);
    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  }),
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  }),
);

// Initiate password reset (send email with token)
router.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const normalizedEmail = String(email).toLowerCase().trim();
      const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (!user) {
        // Don't reveal whether user exists (security best practice)
        return res.json({
          message: "If that email exists, a reset link has been sent",
        });
      }

      // Generate reset token
      const resetToken = generateResetToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Save token to database
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token: resetToken,
          expiresAt,
        },
      });

      // Send email with reset link
      await sendPasswordResetEmail(user, resetToken);

      return res.json({
        message: "If that email exists, a reset link has been sent",
      });
    } catch (err) {
      console.error("Forgot password error:", err);
      return res
        .status(400)
        .json({ message: err.message || "Reset request failed" });
    }
  }),
);

// Reset password with token
router.post(
  "/reset-password",
  asyncHandler(async (req, res) => {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res
          .status(400)
          .json({ message: "Token and password are required" });
      }

      // Find valid reset token
      const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!resetToken) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      // Check if token is expired
      if (new Date() > resetToken.expiresAt) {
        return res.status(400).json({ message: "Reset token has expired" });
      }

      // Check if token was already used
      if (resetToken.usedAt) {
        return res
          .status(400)
          .json({ message: "Reset token has already been used" });
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(String(password), 10);

      // Update user password and mark token as used
      await Promise.all([
        prisma.user.update({
          where: { id: resetToken.userId },
          data: { passwordHash },
        }),
        prisma.passwordResetToken.update({
          where: { token },
          data: { usedAt: new Date() },
        }),
      ]);

      return res.json({ message: "Password reset successful" });
    } catch (err) {
      console.error("Reset password error:", err);
      return res
        .status(400)
        .json({ message: err.message || "Password reset failed" });
    }
  }),
);

// Dev-only: Direct password reset (for testing)
router.post(
  "/dev/reset-password",
  asyncHandler(async (req, res) => {
    if (process.env.NODE_ENV === "production") {
      return res.status(404).json({ message: "Not found" });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return res.json({ message: "Password reset successful" });
  }),
);

export default router;
