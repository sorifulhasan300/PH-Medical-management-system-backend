import { Router } from "express";
import { doctorController } from "./doctor.controller";
import { CheckAuth } from "../../../middleware/auth-middleware";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", CheckAuth(UserRole.ADMIN), doctorController.getAllDoctors);
router.get("/:id", doctorController.doctorById);
router.patch("/:id", doctorController.updateDoctor);
router.patch("/soft-delete/:id", doctorController.softDeleteDoctor);

export const DoctorRoutes = router;
