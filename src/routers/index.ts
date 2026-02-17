import { Router } from "express";
import { specialtiesRouter } from "../app/module/specialty/specialty.route";

const router = Router();
router.use("/specialties", specialtiesRouter);
export const apiRouter = router;
