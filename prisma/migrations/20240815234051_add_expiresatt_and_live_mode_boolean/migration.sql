/*
  Warnings:

  - Added the required column `expiresAt` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Status" ADD VALUE 'EXPIRED';
ALTER TYPE "Status" ADD VALUE 'REFUNDED';

-- AlterTable
ALTER TABLE "Payments" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "liveMode" BOOLEAN NOT NULL DEFAULT false;
