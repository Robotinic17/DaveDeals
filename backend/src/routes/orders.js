import express from "express";
import prisma from "../db.js";
import { authenticate } from "../middleware/auth.js";
import { sendOrderConfirmation } from "../lib/email.js";
import { initializePayment, verifyPayment } from "../lib/paystack.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

function asPositiveInt(value, fallback = 1) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(1, Math.trunc(num));
}

async function validateCheckoutItems(items, productIds) {
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      status: "PUBLISHED",
    },
    select: {
      id: true,
      price: true,
      currency: true,
      title: true,
    },
  });

  const productsById = new Map(
    products.map((product) => [product.id, product]),
  );
  const unavailable = productIds.filter((id) => !productsById.has(id));

  if (unavailable.length) {
    throw new Error(`Some items unavailable: ${unavailable.join(", ")}`);
  }

  const orderItems = items.map((item) => {
    const productId = String(item.productId);
    const product = productsById.get(productId);
    const quantity = asPositiveInt(item.quantity, 1);

    return {
      productId,
      quantity,
      unitPrice: product.price,
    };
  });

  const total = orderItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const currency = products[0]?.currency || "USD";

  return { orderItems, total, currency, products };
}

router.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    const orders = await prisma.order.findMany({
      where: { buyerId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return res.json(orders);
  }),
);

// Initialize Paystack payment
router.post(
  "/checkout/initialize",
  authenticate,
  asyncHandler(async (req, res) => {
    try {
      const items = Array.isArray(req.body?.items) ? req.body.items : [];
      const shippingAddress = req.body?.shippingAddress || {};

      if (!items.length) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      const productIds = [
        ...new Set(
          items
            .map((item) => String(item?.productId || "").trim())
            .filter(Boolean),
        ),
      ];

      if (!productIds.length) {
        return res.status(400).json({ message: "Invalid checkout items" });
      }

      const { orderItems, total, currency, products } =
        await validateCheckoutItems(items, productIds);

      // Generate transaction reference
      const reference = `DDF_${req.user.id}_${Date.now()}`;

      // Initialize Paystack payment
      const payment = await initializePayment({
        email: req.user.email,
        amount: Math.round(total), // Assume total is already in kobo or smallest unit
        reference,
        metadata: {
          buyerId: req.user.id,
          items: orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          shippingAddress,
        },
      });

      return res.json({
        success: true,
        payment,
        checkout: {
          reference,
          total,
          currency,
          itemCount: items.length,
        },
      });
    } catch (err) {
      console.error("Checkout initialize error:", err);
      return res
        .status(400)
        .json({ message: err.message || "Initialization failed" });
    }
  }),
);

// Verify payment and create order
router.post(
  "/checkout/verify",
  authenticate,
  asyncHandler(async (req, res) => {
    try {
      const { reference } = req.body;

      if (!reference) {
        return res.status(400).json({ message: "Payment reference required" });
      }

      // Verify with Paystack
      const verification = await verifyPayment(reference);

      if (!verification.verified) {
        return res.status(400).json({ message: "Payment verification failed" });
      }

      const metadata = verification.metadata || {};
      const items = metadata.items || [];
      const shippingAddress = metadata.shippingAddress || {};

      if (!items.length) {
        return res
          .status(400)
          .json({ message: "No items in payment metadata" });
      }

      const productIds = [
        ...new Set(
          items
            .map((item) => String(item?.productId || "").trim())
            .filter(Boolean),
        ),
      ];

      if (!productIds.length) {
        return res.status(400).json({ message: "Invalid items in metadata" });
      }

      // Re-validate items and prices
      const { orderItems, total, currency } = await validateCheckoutItems(
        items,
        productIds,
      );

      // Create order
      const order = await prisma.order.create({
        data: {
          buyerId: req.user.id,
          total,
          currency,
          status: "PAID",
          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
        },
      });

      // Send order confirmation email
      await sendOrderConfirmation(order, req.user);

      return res.status(201).json({
        success: true,
        order,
        payment: {
          provider: "PAYSTACK",
          reference: verification.reference,
          status: verification.status,
          paidAt: verification.paidAt,
        },
        shippingAddress,
      });
    } catch (err) {
      console.error("Checkout verify error:", err);
      return res
        .status(400)
        .json({ message: err.message || "Verification failed" });
    }
  }),
);

// Mock checkout (for demo/testing without Paystack)
router.post(
  "/checkout",
  authenticate,
  asyncHandler(async (req, res) => {
    try {
      const items = Array.isArray(req.body?.items) ? req.body.items : [];
      const shippingAddress = req.body?.shippingAddress || {};

      if (!items.length) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      const productIds = [
        ...new Set(
          items
            .map((item) => String(item?.productId || "").trim())
            .filter(Boolean),
        ),
      ];

      if (!productIds.length) {
        return res.status(400).json({ message: "Invalid checkout items" });
      }

      const { orderItems, total, currency } = await validateCheckoutItems(
        items,
        productIds,
      );

      const order = await prisma.order.create({
        data: {
          buyerId: req.user.id,
          total,
          currency,
          status: "PAID",
          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
        },
      });

      // Send order confirmation email
      await sendOrderConfirmation(order, req.user);

      return res.status(201).json({
        order,
        payment: {
          provider: "MOCK",
          method: req.body?.paymentMethod || "MOCK_CARD",
          reference: req.body?.paymentReference || `mock_${order.id}`,
          status: "succeeded",
          note: "Demo payment only. No money was charged.",
        },
        shippingAddress,
      });
    } catch (err) {
      console.error("Checkout error:", err);
      return res
        .status(400)
        .json({ message: err.message || "Checkout failed" });
    }
  }),
);

export default router;
