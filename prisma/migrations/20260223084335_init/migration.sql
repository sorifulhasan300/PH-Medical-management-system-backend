/*
  Warnings:

  - You are about to drop the column `doctorId` on the `medical_reports` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "medical_reports" DROP CONSTRAINT "medical_reports_doctorId_fkey";

-- AlterTable
ALTER TABLE "medical_reports" DROP COLUMN "doctorId";
