-- CreateTable
CREATE TABLE "cases" (
    "id" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "issue" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cases_pkey" PRIMARY KEY ("id")
);
