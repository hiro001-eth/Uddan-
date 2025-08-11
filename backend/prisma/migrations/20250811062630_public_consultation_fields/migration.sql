/*
  Warnings:

  - Added the required column `email` to the `Consultation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Consultation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Consultation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preferredDate` to the `Consultation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preferredTime` to the `Consultation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Consultation" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "preferredDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "preferredTime" TEXT NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;
