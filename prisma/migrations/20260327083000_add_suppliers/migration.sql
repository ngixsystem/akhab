CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Supplier_slug_key" ON "Supplier"("slug");
CREATE UNIQUE INDEX "Supplier_name_key" ON "Supplier"("name");

INSERT INTO "Supplier" ("id", "slug", "name", "description", "isActive", "createdAt", "updatedAt")
VALUES (
    'supplier_metiks',
    'metiks',
    'OOO METIKS',
    'Legacy/default supplier created during supplier migration.',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO NOTHING;

ALTER TABLE "Product" ADD COLUMN "supplierId" TEXT;

UPDATE "Product"
SET "supplierId" = 'supplier_metiks'
WHERE "supplierId" IS NULL;

ALTER TABLE "Product" ALTER COLUMN "supplierId" SET NOT NULL;

ALTER TABLE "Product"
ADD CONSTRAINT "Product_supplierId_fkey"
FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
