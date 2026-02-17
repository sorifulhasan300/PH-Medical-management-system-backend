import { Router } from "express";
import { specialtiesController } from "./specialty.controller";

const router = Router();

router.get("/", specialtiesController.getAllSpecialties);
router.post("/", specialtiesController.createSpecialty);
router.delete("/:id", specialtiesController.deleteSpecialty);
router.put("/:id", specialtiesController.updateSpecialty);

export const specialtiesRouter = router;
