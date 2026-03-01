import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { AppointmentController } from "./appointment.controller";
import { CheckAuth } from "../../../middleware/auth-middleware";

const router = Router();

router.post(
  "/book-appointment",
  CheckAuth(UserRole.PATIENT),
  AppointmentController.bookAppointment,
);
router.get(
  "/my-appointments",
  CheckAuth(UserRole.PATIENT, UserRole.DOCTOR),
  AppointmentController.getMyAppointments,
);
router.patch(
  "/change-appointment-status/:id",
  CheckAuth(
    UserRole.PATIENT,
    UserRole.DOCTOR,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  ),
  AppointmentController.changeAppointmentStatus,
);
router.get(
  "/my-single-appointment/:id",
  CheckAuth(UserRole.PATIENT, UserRole.DOCTOR),
  AppointmentController.getMySingleAppointment,
);
router.get(
  "/all-appointments",
  CheckAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AppointmentController.getAllAppointments,
);
router.post(
  "/book-appointment-with-pay-later",
  CheckAuth(UserRole.PATIENT),
  AppointmentController.bookAppointmentWithPayLater,
);
router.post(
  "/initiate-payment/:id",
  CheckAuth(UserRole.PATIENT),
  AppointmentController.initiatePayment,
);

export const AppointmentRoutes = router;
