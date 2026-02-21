import { StatusCodes } from "http-status-codes";
import AppError from "../../../error-helper/app.error.helper";
import { Gender, Specialty, UserRole } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { DoctorPayload } from "./user.interface";

const createDoctor = async (payload: DoctorPayload) => {
  const specialties: Specialty[] = [];

  for (const specialtyId of payload.specialties) {
    const specialty = await prisma.specialty.findUnique({
      where: { id: specialtyId },
    });
    if (specialty) {
      specialties.push(specialty);
    } else {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        `Specialty with ID ${specialtyId} not found`,
      );
    }
  }

  const userExists = await prisma.user.findUnique({
    where: { email: payload.doctor.email },
  });
  if (userExists) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "User with this email already exists",
    );
  }

  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.doctor.email,
      password: payload.password,
      role: UserRole.DOCTOR,
      name: payload.doctor.name,
      needPasswordChange: true,
    },
  });
  if (!userData.user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Failed to create user");
  }
  try {
    const result = await prisma.$transaction(async (tx) => {
      const doctorData = await tx.doctor.create({
        data: {
          ...payload.doctor,
          gender: payload.doctor.gender as Gender,
          userId: userData.user.id,
        },
      });

      const doctorSpecialtiesData = specialties.map((specialty) => ({
        doctorId: doctorData.id,
        specialtyId: specialty.id,
      }));

      await tx.doctorSpecialty.createMany({
        data: doctorSpecialtiesData,
      });

      const doctor = await tx.doctor.findUnique({
        where: { id: doctorData.id },
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          registrationNumber: true,
          experience: true,
          specialties: {
            include: {
              specialty: true,
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              emailVerified: true,
              isDeleted: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });
      return doctor;
    });

    return result;
  } catch (error) {
    // Rollback user creation if doctor creation fails
    await prisma.user.delete({
      where: { id: userData.user.id },
    });
    throw error;
  }
};

export const userService = {
  createDoctor,
};
