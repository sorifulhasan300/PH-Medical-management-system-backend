import { Router } from "express";
import { CheckAuth } from "../../../middleware/auth-middleware";
import { UserRole } from "../../../generated/prisma/enums";
import { ScheduleValidation } from "./schedule.validation";
import { ScheduleController } from "./schedule.controller";
import validationMiddleware from "../../../middleware/validation.middleware";

const router = Router();

router.post(
  "/",
  CheckAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validationMiddleware(ScheduleValidation.createScheduleZodSchema),
  ScheduleController.createSchedule,
);
router.get(
  "/",
  CheckAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR),
  ScheduleController.getAllSchedules,
);
router.get(
  "/:id",
  CheckAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR),
  ScheduleController.getScheduleById,
);
router.patch(
  "/:id",
  CheckAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validationMiddleware(ScheduleValidation.updateScheduleZodSchema),
  ScheduleController.updateSchedule,
);
router.delete(
  "/:id",
  CheckAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ScheduleController.deleteSchedule,
);

export const ScheduleRoutes = router;
