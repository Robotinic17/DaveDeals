import { Resend } from "resend";

let resend = null;

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

const emailFrom = process.env.EMAIL_FROM || "orders@davedeals.local";

export async function sendOrderConfirmation(order, user) {
  const client = getResend();
  if (!client) {
    console.warn("RESEND_API_KEY not set — skipping email");
    return { success: false };
  }

  try {
    const result = await client.emails.send({
      from: emailFrom,
      to: user.email,
      subject: `Order Confirmed — #${order.id.slice(0, 8)}`,
      html: `
        <h2>Order Confirmed!</h2>
        <p>Hi ${user.name},</p>
        <p>Your order <strong>#${order.id.slice(0, 8)}</strong> has been confirmed.</p>
        <p><strong>Total:</strong> ${order.currency} ${(order.total / 100).toFixed(2)}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p>You can track your order on your DaveDeals dashboard.</p>
        <p>Thank you for shopping with DaveDeals!</p>
      `,
    });
    console.log("Order confirmation email sent:", order.id);
    return { success: true, ...result };
  } catch (err) {
    console.error("Failed to send order confirmation:", err);
    return { success: false, error: err.message };
  }
}

export async function sendSellerApprovalEmail(user, applicationId) {
  const client = getResend();
  if (!client) {
    console.warn("RESEND_API_KEY not set — skipping email");
    return { success: false };
  }

  try {
    const result = await client.emails.send({
      from: emailFrom,
      to: user.email,
      subject: "Your DaveDeals Seller Application has been Approved!",
      html: `
        <h2>Great News!</h2>
        <p>Hi ${user.name},</p>
        <p>Your seller application has been approved! 🎉</p>
        <p>You can now start adding products and managing your store.</p>
        <p><a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/seller-portal">Visit Seller Portal</a></p>
        <p>Welcome to the DaveDeals marketplace!</p>
      `,
    });
    console.log("Seller approval email sent:", user.email);
    return { success: true, ...result };
  } catch (err) {
    console.error("Failed to send seller approval email:", err);
    return { success: false, error: err.message };
  }
}

export async function sendSellerRejectionEmail(user, reason) {
  const client = getResend();
  if (!client) {
    console.warn("RESEND_API_KEY not set — skipping email");
    return { success: false };
  }

  try {
    const result = await client.emails.send({
      from: emailFrom,
      to: user.email,
      subject: "Your DaveDeals Seller Application",
      html: `
        <h2>Application Status Update</h2>
        <p>Hi ${user.name},</p>
        <p>Thank you for your interest in joining DaveDeals as a seller.</p>
        <p><strong>Reason:</strong> ${reason || "Your application did not meet our requirements at this time."}</p>
        <p>You may reapply after addressing the feedback above.</p>
        <p>Questions? Contact us at support@davedeals.local</p>
      `,
    });
    console.log("Seller rejection email sent:", user.email);
    return { success: true, ...result };
  } catch (err) {
    console.error("Failed to send seller rejection email:", err);
    return { success: false, error: err.message };
  }
}

export async function sendPasswordResetEmail(user, resetToken) {
  const client = getResend();
  if (!client) {
    console.warn("RESEND_API_KEY not set — skipping email");
    return { success: false };
  }

  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/account-auth?mode=reset&token=${resetToken}`;

  try {
    const result = await client.emails.send({
      from: emailFrom,
      to: user.email,
      subject: "Reset Your DaveDeals Password",
      html: `
        <h2>Password Reset Request</h2>
        <p>Hi ${user.name},</p>
        <p>We received a request to reset your password.</p>
        <p><a href="${resetUrl}">Click here to reset your password</a></p>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });
    console.log("Password reset email sent:", user.email);
    return { success: true, ...result };
  } catch (err) {
    console.error("Failed to send password reset email:", err);
    return { success: false, error: err.message };
  }
}
