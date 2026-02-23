import { Router } from "express";
import { userController } from "./user.controller";
import validationMiddleware from "../../../middleware/validation.middleware";
import { adminSchema, doctorSchema, SuperAdminSchema } from "./user.validation";
import { CheckAuth } from "../../../middleware/auth-middleware";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();
router.post(
  "/create-doctor",
  validationMiddleware(doctorSchema),
  userController.createDoctor,
);
router.post(
  "/create-admin",
  validationMiddleware(adminSchema),
  userController.createAdmin,
);
router.post(
  "/create/super-admin",
  validationMiddleware(SuperAdminSchema),
  userController.createSuperAdmin,
);
router.get(
  "/me",
  CheckAuth(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT,
    UserRole.SUPER_ADMIN,
  ),
  userController.getMe,
);
export const userRoute = router;
