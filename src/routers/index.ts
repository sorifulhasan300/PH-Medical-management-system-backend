import { Router } from "express";
import { specialtiesRouter } from "../app/module/specialty/specialty.route";
import { AuthRoute } from "../app/module/auth/auth.route";

const router = Router();
router.use("/specialties", specialtiesRouter);
router.use("/auth", AuthRoute);

export const apiRouter = router;
