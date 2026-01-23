-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "FulfillmentStatus" AS ENUM ('UNFULFILLED', 'PARTIALLY_FULFILLED', 'FULFILLED', 'RETURNED');

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "status",
ADD COLUMN "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "orderNumber" TEXT NOT NULL,
ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "fulfillmentStatus" "FulfillmentStatus" NOT NULL DEFAULT 'UNFULFILLED',
ADD COLUMN "subtotal" DECIMAL(10,2) NOT NULL,
ADD COLUMN "taxAmount" DECIMAL(10,2) NOT NULL,
ADD COLUMN "shippingCost" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'MAD',
ADD COLUMN "shippingAddress" JSONB NOT NULL,
ADD COLUMN "billingAddress" JSONB,
ADD COLUMN "paymentMethod" TEXT,
ADD COLUMN "paymentId" TEXT,
ADD COLUMN "paidAt" TIMESTAMP(3),
ADD COLUMN "notes" TEXT,
ADD COLUMN "cancelReason" TEXT,
ADD COLUMN "cancelledAt" TIMESTAMP(3),
ADD COLUMN "estimatedDelivery" TIMESTAMP(3),
ADD COLUMN "deliveredAt" TIMESTAMP(3),
ALTER COLUMN "totalAmount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "order_items" 
ADD COLUMN "sku" TEXT NOT NULL,
ADD COLUMN "name" TEXT NOT NULL,
ADD COLUMN "subtotal" DECIMAL(10,2) NOT NULL,
ADD COLUMN "image" TEXT,
ADD COLUMN "reservationId" TEXT,
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- CreateTable
CREATE TABLE "order_status_history" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "fromStatus" "OrderStatus",
    "toStatus" "OrderStatus" NOT NULL,
    "changedBy" TEXT,
    "reason" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_sequences" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_sequences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_userId_idx" ON "orders"("userId");

-- CreateIndex
CREATE INDEX "orders_orderNumber_idx" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_createdAt_idx" ON "orders"("createdAt");

-- CreateIndex
CREATE INDEX "order_items_sku_idx" ON "order_items"("sku");

-- CreateIndex
CREATE INDEX "order_status_history_orderId_idx" ON "order_status_history"("orderId");

-- CreateIndex
CREATE INDEX "order_status_history_createdAt_idx" ON "order_status_history"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "order_sequences_year_key" ON "order_sequences"("year");

-- CreateIndex
CREATE INDEX "order_sequences_year_idx" ON "order_sequences"("year");

-- AddForeignKey
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
