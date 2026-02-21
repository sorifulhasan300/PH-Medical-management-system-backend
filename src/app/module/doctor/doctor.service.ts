import { StatusCodes } from "http-status-codes";
import AppError from "../../../error-helper/app.error.helper";
import { Doctor } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const allDoctors = async () => {
  const doctors = await prisma.doctor.findMany({
    include: {
      specialties: true,
      user: true,
    },
  });
  return doctors;
};

const doctorById = async ({ id }: { id: string }) => {
  const doctorExist = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });
  if (!doctorExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Doctor not found");
  }
  const doctor = await prisma.doctor.findUnique({
    where: {
      id,
    },
    include: {
      specialties: true,
      user: true,
    },
  });
  return doctor;
};

const updateDoctor = async ({
  payload,
  id,
}: {
  payload: Partial<Doctor>;
  id: string;
}) => {
  const doctorExist = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });
  if (!doctorExist) {
    throw new Error("Doctor not found");
  }
  const doctor = await prisma.doctor.update({
    where: {
      id,
    },
    data: payload,
  });
  return doctor;
};

const softDeleteDoctor = async ({ id }: { id: string }) => {
  const doctorExist = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });
  if (!doctorExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Doctor not found");
  }
  const doctor = await prisma.doctor.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
  return doctor;
};

export const doctorService = {
  allDoctors,
  updateDoctor,
  softDeleteDoctor,
  doctorById,
};
