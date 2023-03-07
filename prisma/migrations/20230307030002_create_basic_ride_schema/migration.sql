-- CreateEnum
CREATE TYPE "RideState" AS ENUM ('STARTED', 'FINISHED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('RIDER', 'DRIVER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "password" TEXT NOT NULL,
    "currentLatitude" DECIMAL(65,30),
    "currentLongitude" DECIMAL(65,30),
    "phoneNumber" TEXT NOT NULL,
    "phonePrefix" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ride" (
    "id" TEXT NOT NULL,
    "state" "RideState" NOT NULL DEFAULT 'STARTED',
    "initialLatitude" DECIMAL(65,30) NOT NULL,
    "initialLongitude" DECIMAL(65,30) NOT NULL,
    "finalLatitude" DECIMAL(65,30),
    "finalLongitude" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "clientId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION,
    "transactionId" TEXT,
    "transactionReference" TEXT,
    "elapsedMinutes" DOUBLE PRECISION,

    CONSTRAINT "Ride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL,
    "preferred" BOOLEAN NOT NULL DEFAULT false,
    "wompiId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RideChange" (
    "id" TEXT NOT NULL,
    "rideId" TEXT NOT NULL,
    "lastStatus" "RideState" NOT NULL,
    "newStatus" "RideState" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RideChange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Ride_transactionId_key" ON "Ride"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Ride_transactionReference_key" ON "Ride"("transactionReference");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_userId_token_key" ON "PaymentMethod"("userId", "token");

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RideChange" ADD CONSTRAINT "RideChange_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "Ride"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
