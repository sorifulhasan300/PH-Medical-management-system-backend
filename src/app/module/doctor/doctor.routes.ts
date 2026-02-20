import { Router } from "express";
import { doctorController } from "./doctor.controller";

const router = Router();

router.get("/", doctorController.getAllDoctors);
router.get("/:id", doctorController.doctorById);
router.patch("/:id", doctorController.updateDoctor);
router.patch("/soft-delete/:id", doctorController.softDeleteDoctor);

export const DoctorRoutes = router;
