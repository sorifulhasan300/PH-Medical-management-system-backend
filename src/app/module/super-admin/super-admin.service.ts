import { StatusCodes } from "http-status-codes";
import AppError from "../../../error-helper/app.error.helper";
import { Admin, SuperAdmin } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getAllSuperAdmin = async () => {
  const admins = await prisma.superAdmin.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      user: true,
    },
  });
  return admins;
};

const superAdminById = async ({ id }: { id: string }) => {
  const adminExist = await prisma.superAdmin.findUnique({
    where: {
      id,
    },
  });
  if (!adminExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Super Admin not found");
  }
  const admin = await prisma.superAdmin.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });
  return admin;
};

const updateSuperAdmin = async ({
  payload,
  id,
}: {
  payload: Partial<SuperAdmin>;
  id: string;
}) => {
  const doctorExist = await prisma.superAdmin.findUnique({
    where: {
      id,
    },
  });
  if (!doctorExist) {
    throw new Error("Super Admin not found");
  }
  const admin = await prisma.superAdmin.update({
    where: {
      id,
    },
    data: payload,
  });
  return admin;
};

const softDeleteSuperAdmin = async ({ id }: { id: string }) => {
  const superAdminExist = await prisma.superAdmin.findUnique({
    where: {
      id,
    },
  });
  if (!superAdminExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Super Admin not found");
  }
  const superAdmin = await prisma.superAdmin.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
  return superAdmin;
};

export const superAdminService = {
  getAllSuperAdmin,
  updateSuperAdmin,
  softDeleteSuperAdmin,
  superAdminById,
};
