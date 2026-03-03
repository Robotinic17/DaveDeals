const REQUIRED_STEPS = [
  {
    key: "storeName",
    label: "Store identity",
    weight: 20,
    test: (seller) => Boolean(String(seller.storeName || "").trim()),
  },
  {
    key: "businessDetails",
    label: "Business details",
    weight: 20,
    test: (seller) =>
      Boolean(String(seller.businessType || "").trim()) &&
      Boolean(String(seller.phone || "").trim()) &&
      Boolean(String(seller.country || "").trim()) &&
      Boolean(String(seller.address || "").trim()),
  },
  {
    key: "branding",
    label: "Branding",
    weight: 15,
    test: (seller) =>
      Boolean(String(seller.logoUrl || "").trim()) &&
      Boolean(String(seller.description || "").trim()),
  },
  {
    key: "categories",
    label: "Selling categories",
    weight: 15,
    test: (seller) => Array.isArray(seller.categories) && seller.categories.length > 0,
  },
  {
    key: "regionCurrency",
    label: "Region and currency",
    weight: 15,
    test: (seller) =>
      Boolean(seller.regionId) &&
      Boolean(String(seller.preferredCurrency || "").trim()),
  },
  {
    key: "terms",
    label: "Seller terms",
    weight: 15,
    test: (seller) => Boolean(seller.termsAccepted),
  },
];

export function buildSellerOnboarding(seller) {
  const steps = REQUIRED_STEPS.map((step) => ({
    key: step.key,
    label: step.label,
    weight: step.weight,
    complete: step.test(seller),
  }));

  const score = steps.reduce(
    (total, step) => total + (step.complete ? step.weight : 0),
    0,
  );
  const completedCount = steps.filter((step) => step.complete).length;
  const isComplete = score === 100;

  return {
    score,
    isComplete,
    completedCount,
    totalSteps: steps.length,
    steps,
  };
}
