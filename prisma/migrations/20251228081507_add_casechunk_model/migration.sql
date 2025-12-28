-- CreateTable
CREATE TABLE "case_chunks" (
    "id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "embedding" vector(3072) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "case_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "case_chunks_case_id_idx" ON "case_chunks"("case_id");

-- Note: Vector indexes (ivfflat/hnsw) support max 2000 dimensions
-- text-embedding-3-large has 3072 dimensions, so no index is created
-- Full table scan will be used for similarity search (acceptable for small-medium datasets)

-- AddForeignKey
ALTER TABLE "case_chunks" ADD CONSTRAINT "case_chunks_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
