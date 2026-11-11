-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- Data migration: one category per distinct existing product category (case-insensitive)
INSERT INTO "categories" ("id", "name", "slug")
SELECT
    gen_random_uuid()::text,
    MIN(TRIM("category")),
    TRIM(BOTH '-' FROM REGEXP_REPLACE(LOWER(TRIM("category")), '[^a-z0-9]+', '-', 'g'))
FROM "products"
GROUP BY LOWER(TRIM("category"))
HAVING TRIM(BOTH '-' FROM REGEXP_REPLACE(LOWER(TRIM("category")), '[^a-z0-9]+', '-', 'g')) <> '';

-- Products whose category had no usable slug fall back to a generic category
INSERT INTO "categories" ("id", "name", "slug")
SELECT gen_random_uuid()::text, 'Outros', 'outros'
WHERE EXISTS (
    SELECT 1 FROM "products" p
    WHERE TRIM(BOTH '-' FROM REGEXP_REPLACE(LOWER(TRIM(p."category")), '[^a-z0-9]+', '-', 'g')) = ''
)
AND NOT EXISTS (SELECT 1 FROM "categories" WHERE "slug" = 'outros');

-- AlterTable: add nullable FK column, backfill, then enforce NOT NULL
ALTER TABLE "products" ADD COLUMN "categoryId" TEXT;

UPDATE "products" p
SET "categoryId" = c."id"
FROM "categories" c
WHERE c."slug" = TRIM(BOTH '-' FROM REGEXP_REPLACE(LOWER(TRIM(p."category")), '[^a-z0-9]+', '-', 'g'));

UPDATE "products"
SET "categoryId" = (SELECT "id" FROM "categories" WHERE "slug" = 'outros')
WHERE "categoryId" IS NULL;

ALTER TABLE "products" ALTER COLUMN "categoryId" SET NOT NULL;
ALTER TABLE "products" DROP COLUMN "category";

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
