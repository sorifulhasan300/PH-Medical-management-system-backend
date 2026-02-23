import { Router } from "express";
import { adminController } from "./admin.controller";
import validationMiddleware from "../../../middleware/validation.middleware";
import { adminUpdateSchema } from "./admin.validation";

const router = Router();

router.get("/", adminController.getAllAdmin);
router.get("/:id", adminController.adminById);
router.patch(
  "/:id",
  validationMiddleware(adminUpdateSchema),
  adminController.updateAdmin,
);
router.patch("/soft-delete/:id", adminController.softDeleteAdmin);

export const AdminRoutes = router;
