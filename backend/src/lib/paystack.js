const PAYSTACK_API = "https://api.paystack.co";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  };
}

export async function initializePayment({
  email,
  amount,
  reference,
  metadata = {},
}) {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    throw new Error("PAYSTACK_SECRET_KEY not configured");
  }

  const body = {
    email,
    amount, // in kobo (1 NGN = 100 kobo)
    reference,
    metadata,
    callback_url: `${process.env.FRONTEND_URL}/checkout?payment_status=completed&reference=${reference}`,
  };

  try {
    const response = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Paystack initialization failed");
    }

    return {
      success: true,
      authorizationUrl: data.data.authorization_url,
      accessCode: data.data.access_code,
      reference: data.data.reference,
    };
  } catch (err) {
    console.error("Paystack initialization error:", err);
    throw err;
  }
}

export async function verifyPayment(reference) {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    throw new Error("PAYSTACK_SECRET_KEY not configured");
  }

  try {
    const response = await fetch(
      `${PAYSTACK_API}/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: getHeaders(),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Payment verification failed");
    }

    const transaction = data.data;

    return {
      success: true,
      status: transaction.status,
      reference: transaction.reference,
      amount: transaction.amount, // in kobo
      amountPaid: transaction.amount_paid,
      paidAt: transaction.paid_at,
      metadata: transaction.metadata || {},
      verified: transaction.status === "success",
    };
  } catch (err) {
    console.error("Payment verification error:", err);
    throw err;
  }
}
