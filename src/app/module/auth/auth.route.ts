import { Router } from "express";
import { authController } from "./auth.controller";
import { CheckAuth } from "../../../middleware/auth-middleware";
import { UserRole } from "../../../generated/prisma/enums";

const route = Router();
route.post("/register", authController.registerPatient);
route.post("/login", authController.loginPatient);
route.post("/refresh-token", authController.getNewToken);
route.post("/change-password", authController.changePassword);
route.post(
  "/logout",
  CheckAuth(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT,
    UserRole.SUPER_ADMIN,
  ),
  authController.logoutUser,
);

export const AuthRoute = route;
