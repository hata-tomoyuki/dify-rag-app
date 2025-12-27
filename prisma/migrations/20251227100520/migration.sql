/*
  Warnings:

  - A unique constraint covering the columns `[caseNo]` on the table `cases` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `caseNo` to the `cases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cases" ADD COLUMN     "caseNo" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cases_caseNo_key" ON "cases"("caseNo");
