/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import AppError from "../../../error-helper/app.error.helper";
import { UserStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { statusCodes } from "better-auth";
import { tokenUtils } from "../../utils/token";
import { jwtUtils } from "../../utils/jwt.utils";
import { envVars } from "../../../config/config";
import { JwtPayload } from "jsonwebtoken";
import { refreshToken } from "better-auth/api";
import { ChangePassword } from "./auth.interface";

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

const getNewToken = async (accessToken: string, sessionToken: string) => {
  const isSessionTokenExists = await prisma.session.findUnique({
    where: {
      token: sessionToken,
    },
    include: {
      user: true,
    },
  });

  if (!isSessionTokenExists) {
    throw new AppError(statusCodes.FORBIDDEN, "Invalid SessionToken");
  }
  const verifiedRefreshToken = jwtUtils.verifyToken(
    accessToken,
    envVars.ACCESS_TOKEN_SECRET,
  );
  if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
    throw new AppError(statusCodes.FORBIDDEN, "Token not verify");
  }
  const data = verifiedRefreshToken.data as JwtPayload;
  const freshAccessToken = tokenUtils.getAccessToken({
    userId: data.id,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,
  });
  const freshRefreshToken = tokenUtils.getRefreshToken({
    userId: data.id,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,
  });
  const { token } = await prisma.session.update({
    where: {
      token: sessionToken,
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
      updatedAt: new Date(),
    },
  });
  return {
    accessToken: freshAccessToken,
    refreshToken: freshRefreshToken,
    sessionToken: token,
  };
};

const changePassword = async (
  payload: ChangePassword,
  betterSessionToken: string,
) => {
  const { currentPassword, newPassword } = payload;
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${betterSessionToken}`,
    }),
  });
  if (!session) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid session token");
  }
  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    },
    headers: new Headers({
      Authorization: `Bearer ${betterSessionToken}`,
    }),
  });
  const user = result.user;
  const accessToken = tokenUtils.getAccessToken({
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    status: user.status,
    isDeleted: user.isDeleted,
    emailVerified: user.emailVerified,
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    status: user.status,
    isDeleted: user.isDeleted,
    emailVerified: user.emailVerified,
  });
  return {
    accessToken,
    refreshToken,
    ...result,
  };
};

const logoutUser = async (sessionToken: string) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });
  return result;
};

const verifyEmail = async (email: string, otp: string) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp,
    },
  });
  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
      },
    });
  }
};
const forgetPassword = async (email: string) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
      isDeleted: false,
      status: "ACTIVE",
    },
  });
  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found or inactive!");
  }
  if (!isUserExist.emailVerified) {
    throw new AppError(StatusCodes.NOT_FOUND, "Email not verified!");
  }
  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email,
    },
  });
};
const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
      isDeleted: false,
      status: "ACTIVE",
    },
  });
  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found or inactive!");
  }
  if (!isUserExist.emailVerified) {
    throw new AppError(StatusCodes.NOT_FOUND, "Email not verified!");
  }
  await auth.api.resetPasswordEmailOTP({
    body: {
      email: email,
      otp,
      password: newPassword,
    },
  });
};

const googleLoginSuccess = async (session: Record<string, any>) => {
  const isPatientExixts = await prisma.patient.findUnique({
    where: {
      userId: session.user.id,
    },
  });
  if (!isPatientExixts) {
    await prisma.patient.create({
      data: {
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
  });
  return {
    accessToken,
    refreshToken,
  };
};
export const authService = {
  registerPatient,
  loginPatient,
  getNewToken,
  changePassword,
  logoutUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
  googleLoginSuccess,
};
