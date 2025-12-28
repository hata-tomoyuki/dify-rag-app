/*
  Warnings:

  - You are about to drop the column `customer` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `issue` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `response` on the `cases` table. All the data in the column will be lost.
  - Added the required column `budgetMax` to the `cases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `budgetMin` to the `cases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientName` to the `cases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companySize` to the `cases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationWeeks` to the `cases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `industry` to the `cases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `result` to the `cases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `cases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cases" DROP COLUMN "customer",
DROP COLUMN "issue",
DROP COLUMN "response",
ADD COLUMN     "budgetMax" INTEGER NOT NULL,
ADD COLUMN     "budgetMin" INTEGER NOT NULL,
ADD COLUMN     "challenges" TEXT[],
ADD COLUMN     "clientName" TEXT NOT NULL,
ADD COLUMN     "companySize" TEXT NOT NULL,
ADD COLUMN     "deliverables" TEXT[],
ADD COLUMN     "durationWeeks" INTEGER NOT NULL,
ADD COLUMN     "goals" TEXT[],
ADD COLUMN     "industry" TEXT NOT NULL,
ADD COLUMN     "lessonsLearned" TEXT[],
ADD COLUMN     "proposal" TEXT[],
ADD COLUMN     "result" JSONB NOT NULL,
ADD COLUMN     "stack" TEXT[],
ADD COLUMN     "title" TEXT NOT NULL;
