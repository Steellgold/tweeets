/*
  Warnings:

  - Added the required column `checkoutSessionId` to the `Payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkoutSessionUrl` to the `Payments` table without a default value. This is not possible if the table is not empty.
  - Made the column `priceId` on table `Payments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stripeCustomerId` on table `Payments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Payments" ADD COLUMN     "checkoutSessionId" TEXT NOT NULL,
ADD COLUMN     "checkoutSessionUrl" TEXT NOT NULL,
ALTER COLUMN "priceId" SET NOT NULL,
ALTER COLUMN "stripeCustomerId" SET NOT NULL;
