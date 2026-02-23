import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchasync";
import { sendResponse } from "../../shared/sendresponse";
import { authService } from "./auth.service";
import { tokenUtils } from "../../utils/token";
import AppError from "../../../error-helper/app.error.helper";
import { StatusCodes } from "http-status-codes";

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
export const authController = {
  registerPatient,
  loginPatient,
  getNewToken,
};
