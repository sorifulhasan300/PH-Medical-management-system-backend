import { Router } from "express";
import { specialtiesRouter } from "../app/module/specialty/specialty.route";
import { AuthRoute } from "../app/module/auth/auth.route";
import { userRoute } from "../app/module/user/user.route";

const router = Router();
router.use("/specialties", specialtiesRouter);
router.use("/auth", AuthRoute);
router.use("/user", userRoute);

export const apiRouter = router;
