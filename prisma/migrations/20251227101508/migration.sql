/*
  Warnings:

  - You are about to drop the column `caseNo` on the `cases` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "cases_caseNo_key";

-- AlterTable
ALTER TABLE "cases" DROP COLUMN "caseNo";
