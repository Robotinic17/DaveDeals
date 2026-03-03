ALTER TABLE "Seller"
ADD COLUMN "businessType" TEXT,
ADD COLUMN "phone" TEXT,
ADD COLUMN "country" TEXT,
ADD COLUMN "address" TEXT,
ADD COLUMN "logoUrl" TEXT,
ADD COLUMN "description" TEXT,
ADD COLUMN "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "preferredCurrency" TEXT DEFAULT 'USD',
ADD COLUMN "termsAccepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "onboardingCompletedAt" TIMESTAMP(3);
