import { Router } from "express";
import { userController } from "./user.controller";
import validationMiddleware from "../../../middleware/validation.middleware";
import { adminSchema, doctorSchema } from "./user.validation";

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
export const userRoute = router;
