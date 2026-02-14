-- CreateTable
CREATE TABLE IF NOT EXISTS "properties" (
    "id" TEXT NOT NULL,
    "external_id" TEXT,
    "source" "PropertySource" NOT NULL,
    "status" "PropertyStatus" NOT NULL DEFAULT 'ACTIVE',
    "type" TEXT NOT NULL,
    "property_type" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "price" DOUBLE PRECISION,
    "area" DOUBLE PRECISION,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "parking_spaces" INTEGER,
    "city" TEXT NOT NULL,
    "city_slug" TEXT,
    "neighborhood" TEXT,
    "address" TEXT,
    "url" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "price_per_sqm" DOUBLE PRECISION,
    "views" INTEGER NOT NULL DEFAULT 0,
    "highlighted" BOOLEAN NOT NULL DEFAULT false,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "featured_expires_at" TIMESTAMP(3),
    "deal_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avg_neighborhood_price_sqm" DOUBLE PRECISION,
    "scraped_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "owner_id" TEXT,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- But wait, creating the table if exists is dangerous if columns differ.
-- The drift said: changed properties table, added columns.
-- This means table exists. So use ALTER TABLE.

ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "is_featured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "featured_expires_at" TIMESTAMP(3);
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "highlighted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "views" INTEGER NOT NULL DEFAULT 0;
