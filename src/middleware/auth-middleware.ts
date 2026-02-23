/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { CookieUtils } from "../app/utils/cookie";
import AppError from "../error-helper/app.error.helper";
import { prisma } from "../app/lib/prisma";
import { UserRole, UserStatus } from "../generated/prisma/enums";
import { StatusCodes } from "http-status-codes";
import { jwtUtils } from "../app/utils/jwt.utils";
import { envVars } from "../config/config";

export const CheckAuth =
  (...authRoles: UserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // BETTER AUTH TOKEN VALIDATION
      const sessionToken = CookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );
      if (!sessionToken) {
        throw new Error("Unauthorized access! No session token provide");
      }
      if (sessionToken) {
        const sessionExist = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });
        if (sessionExist && sessionExist.user) {
          const user = sessionExist.user;
          const now = new Date();
          const expiresAt = new Date(sessionExist.expiresAt);
          const createAt = new Date(sessionExist.createdAt);

          const sessionLifeTime = expiresAt.getTime() - createAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();
          const percentRemaining = (timeRemaining / sessionLifeTime) * 100;
          if (percentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
            res.setHeader("X-Time-Remaining", expiresAt.toISOString());
            console.log("Session Expiring Soon!!");
          }
          if (
            user.status === UserStatus.BLOCKED ||
            user.status === UserStatus.DELETED
          ) {
            throw new AppError(
              StatusCodes.UNAUTHORIZED,
              "Unauthorized access! User is not active",
            );
          }
          if (user.isDeleted) {
            throw new AppError(
              StatusCodes.UNAUTHORIZED,
              "Unauthorized access! User is deleted",
            );
          }
          if (authRoles.length > 0 && !authRoles.includes(user.role)) {
            throw new AppError(
              StatusCodes.UNAUTHORIZED,
              "Unauthorized access! You do not have permission to access this resource",
            );
          }
          req.user = {
            userId: user.id,
            role: user.role,
            email: user.email,
          };
        }
      }
      // JWT TOKEN VALIDATION
      const accessToken = CookieUtils.getCookie(req, "accessToken");
      if (!accessToken) {
        throw new AppError(
          StatusCodes.UNAUTHORIZED,
          "Unauthorized access! No access token provided",
        );
      }
      const verifiedToken = jwtUtils.verifyToken(
        accessToken,
        envVars.ACCESS_TOKEN_SECRET,
      );
      if (!verifiedToken) {
        throw new AppError(
          StatusCodes.UNAUTHORIZED,
          "Unauthorized access! Invalid access Token",
        );
      }
      if (
        authRoles.length > 0 &&
        !authRoles.includes(verifiedToken.data!.role)
      ) {
        throw new AppError(
          StatusCodes.FORBIDDEN,
          "Unauthorized access! You don't have permission to access this resource.",
        );
      }

      next();
    } catch (error: any) {
      next(error);
    }
  };
