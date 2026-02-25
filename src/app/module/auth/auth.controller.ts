import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchasync";
import { sendResponse } from "../../shared/sendresponse";
import { authService } from "./auth.service";
import { tokenUtils } from "../../utils/token";
import AppError from "../../../error-helper/app.error.helper";
import { StatusCodes } from "http-status-codes";
import { CookieUtils } from "../../utils/cookie";
import { prisma } from "../../lib/prisma";

const registerPatient = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await authService.registerPatient(payload);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);
  sendResponse(res, {
    success: true,
    message: "Patient registered successfully",
    data: {
      ...rest,
      accessToken,
      refreshToken,
    },
  });
});
const loginPatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.loginPatient(payload);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);

  sendResponse(res, {
    success: true,
    message: "Patient logged in successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});
const getNewToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const betterSessionToken = req.cookies["better-auth.session_token"];
  if (!refreshToken) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Token is missi");
  }
  const result = await authService.getNewToken(
    refreshToken,
    betterSessionToken,
  );
  const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, sessionToken);

  sendResponse(res, {
    httpStatuscode: StatusCodes.OK,
    success: true,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken,
      sessionToken,
    },
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const betterSessionToken = req.cookies["better-auth.session_token"];
  const result = await authService.changePassword(payload, betterSessionToken);
  tokenUtils.setAccessTokenCookie(res, result.accessToken);
  tokenUtils.setRefreshTokenCookie(res, result.refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, result.token as string);
  const id = result.user.id;
  if (result.user.needPasswordChange) {
    await prisma.user.update({
      where: { id },
      data: {
        needPasswordChange: false,
      },
    });
  }
  sendResponse(res, {
    httpStatuscode: StatusCodes.OK,
    success: true,
    message: "password change successfully",
    data: {
      result,
    },
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  const betterSessionToken = req.cookies["better-auth.session_token"];
  const result = await authService.logoutUser(betterSessionToken);

  CookieUtils.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  CookieUtils.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  CookieUtils.clearCookie(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  sendResponse(res, {
    httpStatuscode: StatusCodes.OK,
    success: true,
    message: "Logout successfully",
    data: {
      result,
    },
  });
});
const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  await authService.verifyEmail(email, otp);

  sendResponse(res, {
    httpStatuscode: StatusCodes.OK,
    success: true,
    message: "Email verify successfully",
  });
});
const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.forgetPassword(email);
  sendResponse(res, {
    httpStatuscode: StatusCodes.OK,
    success: true,
    message: "forget password code send successfully. check your email!",
  });
});
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  await authService.resetPassword(email, otp, newPassword);

  sendResponse(res, {
    httpStatuscode: StatusCodes.OK,
    success: true,
    message: "Reset password successfully",
  });
});
const googleLogin = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    httpStatuscode: StatusCodes.OK,
    success: true,
    message: "Login successfully",
  });
});
const googleLoginSuccess = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    httpStatuscode: StatusCodes.OK,
    success: true,
    message: "Reset password successfully",
  });
});
const googleLoginError = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    httpStatuscode: StatusCodes.OK,
    success: true,
    message: "Reset password successfully",
  });
});
export const authController = {
  registerPatient,
  loginPatient,
  getNewToken,
  changePassword,
  logoutUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
  googleLogin,
  googleLoginSuccess,
  googleLoginError,
};
