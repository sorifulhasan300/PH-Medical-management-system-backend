import { Router } from "express";
import { specialtiesRouter } from "../app/module/specialty/specialty.route";
import { AuthRoute } from "../app/module/auth/auth.route";
import { userRoute } from "../app/module/user/user.route";
import { DoctorRoutes } from "../app/module/doctor/doctor.routes";
import { AdminRoutes } from "../app/module/admin/admin.routes";

const router = Router();
router.use("/specialties", specialtiesRouter);
router.use("/auth", AuthRoute);
router.use("/user", userRoute);
router.use("/doctors", DoctorRoutes);
router.use("/admin", AdminRoutes);

export const apiRouter = router;
