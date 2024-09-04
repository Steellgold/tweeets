/*
  Warnings:

  - The `currency` column on the `Payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Payments" DROP COLUMN "currency",
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'usd';

-- DropEnum
DROP TYPE "Currency";
