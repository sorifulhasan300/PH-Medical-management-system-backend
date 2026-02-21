import { Router } from "express";
import { userController } from "./user.controller";
import validationMiddleware from "../../../middleware/validation.middleware";
import { doctorSchema } from "./user.validation";

const router = Router();
router.post(
  "/create-doctor",
  validationMiddleware(doctorSchema),
  userController.createDoctor,
);
export const userRoute = router;
