ALTER TABLE "Product"
ADD COLUMN "category" TEXT,
ADD COLUMN "categorySlug" TEXT;

CREATE INDEX "Product_categorySlug_idx" ON "Product"("categorySlug");
