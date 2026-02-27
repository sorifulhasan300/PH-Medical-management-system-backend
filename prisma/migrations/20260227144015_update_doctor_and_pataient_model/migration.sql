/*
  Warnings:

  - You are about to drop the column `currentWorkplace` on the `doctor` table. All the data in the column will be lost.
  - You are about to drop the column `amunt` on the `payment_data` table. All the data in the column will be lost.
  - You are about to drop the column `appoitnmentId` on the `payment_data` table. All the data in the column will be lost.
  - You are about to drop the column `transectionId` on the `payment_data` table. All the data in the column will be lost.
  - You are about to drop the `patients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prescription_data` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[registrationNumber]` on the table `doctor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[appointmentId]` on the table `payment_data` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `currentWorkingPlace` to the `doctor` table without a default value. This is not possible if the table is not empty.
  - Made the column `registrationNumber` on table `doctor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `experience` on table `doctor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `doctor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `appointmentFee` on table `doctor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `qualification` on table `doctor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `designation` on table `doctor` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `appointmentId` to the `payment_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionId` to the `payment_data` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_patientId_fkey";

-- DropForeignKey
ALTER TABLE "medical_reports" DROP CONSTRAINT "medical_reports_patientId_fkey";

-- DropForeignKey
ALTER TABLE "patient_health_data" DROP CONSTRAINT "patient_health_data_patientId_fkey";

-- DropForeignKey
ALTER TABLE "patients" DROP CONSTRAINT "patients_userId_fkey";

-- DropForeignKey
ALTER TABLE "payment_data" DROP CONSTRAINT "payment_data_appoitnmentId_fkey";

-- DropForeignKey
ALTER TABLE "prescription_data" DROP CONSTRAINT "prescription_data_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_patientId_fkey";

-- DropIndex
DROP INDEX "payment_data_appoitnmentId_key";

-- AlterTable
ALTER TABLE "doctor" DROP COLUMN "currentWorkplace",
ADD COLUMN     "currentWorkingPlace" TEXT NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "profilePhoto" SET DATA TYPE TEXT,
ALTER COLUMN "contactNumber" SET DATA TYPE TEXT,
ALTER COLUMN "registrationNumber" SET NOT NULL,
ALTER COLUMN "registrationNumber" SET DATA TYPE TEXT,
ALTER COLUMN "experience" SET NOT NULL,
ALTER COLUMN "experience" SET DEFAULT 0,
ALTER COLUMN "gender" SET NOT NULL,
ALTER COLUMN "appointmentFee" SET NOT NULL,
ALTER COLUMN "qualification" SET NOT NULL,
ALTER COLUMN "qualification" SET DATA TYPE TEXT,
ALTER COLUMN "designation" SET NOT NULL,
ALTER COLUMN "designation" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "payment_data" DROP COLUMN "amunt",
DROP COLUMN "appoitnmentId",
DROP COLUMN "transectionId",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "appointmentId" TEXT NOT NULL,
ADD COLUMN     "transactionId" TEXT NOT NULL;

-- DropTable
DROP TABLE "patients";

-- DropTable
DROP TABLE "prescription_data";

-- CreateTable
CREATE TABLE "patient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "contactNumber" TEXT,
    "address" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescriptions" (
    "id" TEXT NOT NULL,
    "followUpDate" TIMESTAMP(3) NOT NULL,
    "instructions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,

    CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patient_email_key" ON "patient"("email");

-- CreateIndex
CREATE UNIQUE INDEX "patient_userId_key" ON "patient"("userId");

-- CreateIndex
CREATE INDEX "idx_patient_email" ON "patient"("email");

-- CreateIndex
CREATE INDEX "idx_patient_isDeleted" ON "patient"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "prescriptions_appointmentId_key" ON "prescriptions"("appointmentId");

-- CreateIndex
CREATE INDEX "prescriptions_appointmentId_idx" ON "prescriptions"("appointmentId");

-- CreateIndex
CREATE INDEX "prescriptions_patientId_idx" ON "prescriptions"("patientId");

-- CreateIndex
CREATE INDEX "prescriptions_doctorId_idx" ON "prescriptions"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_registrationNumber_key" ON "doctor"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "payment_data_appointmentId_key" ON "payment_data"("appointmentId");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_reports" ADD CONSTRAINT "medical_reports_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient" ADD CONSTRAINT "patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_health_data" ADD CONSTRAINT "patient_health_data_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_data" ADD CONSTRAINT "payment_data_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "idx_doctor_is_deleted" RENAME TO "idx_doctor_isDeleted";
