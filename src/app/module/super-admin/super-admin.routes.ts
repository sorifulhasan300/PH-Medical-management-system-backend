import { Router } from "express";
import { SuperAdminController } from "./super-admin.controller";
import validationMiddleware from "../../../middleware/validation.middleware";
import { SuperAdminUpdateSchema } from "./super-admin.validation";

const router = Router();

router.get("/", SuperAdminController.getAllSuperAdmin);
router.get("/:id", SuperAdminController.superAdminById);
router.patch(
  "/:id",
  validationMiddleware(SuperAdminUpdateSchema),
  SuperAdminController.updateSuperAdmin,
);
router.patch("/soft-delete/:id", SuperAdminController.softDeleteSuperAdmin);

export const SuperAdminRoutes = router;
