/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import AppError from "../../../error-helper/app.error.helper";
import { UserStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { statusCodes } from "better-auth";
import { tokenUtils } from "../../utils/token";

interface RegisterPatientPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPatientPayload {
  email: string;
  password: string;
}
const registerPatient = async (payload: RegisterPatientPayload) => {
  const { name, email, password } = payload;
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      role: "PATIENT",
    },
  });
  if (!data) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Failed to register patient");
  }

  const patient = await prisma.$transaction(async (tx) => {
    try {
      const createPatient = await tx.patient.create({
        data: {
          userId: data.user.id,
          name: payload.name,
          email: payload.email,
        },
      });
      return createPatient;
    } catch (error) {
      await prisma.user.delete({
        where: { id: data.user.id },
      });
      throw error;
    }
  });
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });
  return {
    ...data,
    patient,
    accessToken,
    refreshToken,
  };
};

const loginPatient = async (payload: LoginPatientPayload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({ body: { email, password } });
  if (!data) {
    throw new Error("Failed to login patient");
  }
  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError(statusCodes.FORBIDDEN, "Patient is blocked");
  }

  if (data.user.isDeleted) {
    throw new AppError(statusCodes.CREATED, "Patient is deleted");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });
  return {
    ...data,
    accessToken,
    refreshToken,
  };
};

export const authService = {
  registerPatient,
  loginPatient,
};
