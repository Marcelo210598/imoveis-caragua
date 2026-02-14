-- CreateTable
CREATE TABLE "property_views" (
    "id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "source" TEXT,
    "viewer_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "property_views_property_id_idx" ON "property_views"("property_id");

-- CreateIndex
CREATE INDEX "property_views_source_idx" ON "property_views"("source");

-- CreateIndex
CREATE INDEX "property_views_created_at_idx" ON "property_views"("created_at");

-- AddForeignKey
ALTER TABLE "property_views" ADD CONSTRAINT "property_views_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
