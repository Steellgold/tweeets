/*
  Warnings:

  - A unique constraint covering the columns `[checkoutSessionId]` on the table `Payments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Payments_checkoutSessionId_key" ON "Payments"("checkoutSessionId");
