import { Router } from "express";
import { specialtiesController } from "./specialty.controller";
import { multerUpload } from "../../../config/multer.config";
import validationMiddleware from "../../../middleware/validation.middleware";
import { SpecialtyValidation } from "./specialty.validation";

const router = Router();

router.get("/", specialtiesController.getAllSpecialties);
router.post(
  "/",
  multerUpload.single("file"),
  validationMiddleware(SpecialtyValidation.specialtySchema),
  specialtiesController.createSpecialty,
);
router.delete("/:id", specialtiesController.deleteSpecialty);
router.put("/:id", specialtiesController.updateSpecialty);

export const specialtiesRouter = router;
