/*
  Warnings:

  - You are about to drop the `DoctorSpecialty` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctors` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DoctorSpecialty" DROP CONSTRAINT "DoctorSpecialty_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorSpecialty" DROP CONSTRAINT "DoctorSpecialty_specialtyId_fkey";

-- DropForeignKey
ALTER TABLE "doctors" DROP CONSTRAINT "doctors_userId_fkey";

-- DropIndex
DROP INDEX "idx_specialty_is_deleted";

-- DropIndex
DROP INDEX "idx_specialty_title";

-- DropTable
DROP TABLE "DoctorSpecialty";

-- DropTable
DROP TABLE "doctors";

-- CreateTable
CREATE TABLE "doctor" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "profilePhoto" VARCHAR(100),
    "contactNumber" VARCHAR(20),
    "registrationNumber" VARCHAR(50),
    "experience" INTEGER,
    "gender" "Gender",
    "address" TEXT,
    "appointmentFee" DOUBLE PRECISION,
    "qualification" VARCHAR(255),
    "currentWorkplace" VARCHAR(255),
    "designation" VARCHAR(255),
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_specialties" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "specialtyId" TEXT NOT NULL,

    CONSTRAINT "doctor_specialties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctor_email_key" ON "doctor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_userId_key" ON "doctor"("userId");

-- CreateIndex
CREATE INDEX "idx_doctor_is_deleted" ON "doctor"("isDeleted");

-- CreateIndex
CREATE INDEX "idx_doctor_email" ON "doctor"("email");

-- AddForeignKey
ALTER TABLE "doctor" ADD CONSTRAINT "doctor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "specialties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
