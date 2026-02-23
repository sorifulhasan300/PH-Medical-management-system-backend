import { Router } from "express";
import { userController } from "./user.controller";
import validationMiddleware from "../../../middleware/validation.middleware";
import { adminSchema, doctorSchema, SuperAdminSchema } from "./user.validation";

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
export const userRoute = router;
