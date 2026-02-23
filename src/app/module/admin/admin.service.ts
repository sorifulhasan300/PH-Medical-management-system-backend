import { StatusCodes } from "http-status-codes";
import AppError from "../../../error-helper/app.error.helper";
import { Admin } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { RequestUser } from "../../../interface/requestUser.interface";

const getAllAdmin = async () => {
  const admins = await prisma.admin.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      user: true,
    },
  });
  return admins;
};

const adminById = async ({ id }: { id: string }) => {
  const adminExist = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  if (!adminExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Admin not found");
  }
  const admin = await prisma.admin.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });
  return admin;
};

const updateAdmin = async ({
  payload,
  id,
}: {
  payload: Partial<Admin>;
  id: string;
}) => {
  const doctorExist = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  if (!doctorExist) {
    throw new Error("Admin not found");
  }
  const admin = await prisma.admin.update({
    where: {
      id,
    },
    data: payload,
  });
  return admin;
};

const softDeleteAdmin = async (id: string, user: RequestUser) => {
  const adminExist = await prisma.admin.findUnique({
    where: {
      id,
    },
  });

  if (adminExist?.userId === user.userId) {
    throw new AppError(StatusCodes.FORBIDDEN, "can't delete yourself");
  }

  if (!adminExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Admin not found");
  }
  const admin = await prisma.admin.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
  return admin;
};

export const adminService = {
  getAllAdmin,
  updateAdmin,
  softDeleteAdmin,
  adminById,
};
