-- CreateEnum
CREATE TYPE "AvailabilityType" AS ENUM ('RECURRING', 'SPECIFIC_DATE');

-- CreateTable
CREATE TABLE "availabilities" (
    "id" TEXT NOT NULL,
    "type" "AvailabilityType" NOT NULL,
    "dayOfWeek" INTEGER,
    "date" TIMESTAMP(3),
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "availabilities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "availabilities_dayOfWeek_type_idx" ON "availabilities"("dayOfWeek", "type");

-- CreateIndex
CREATE INDEX "availabilities_date_type_idx" ON "availabilities"("date", "type");
