// import { Router } from "express";

// import { DoctorScheduleController } from "./doctorSchedule.controller";
// import { CheckAuth } from "../../../middleware/auth-middleware";
// import { UserRole } from "../../../generated/prisma/enums";

// const router = Router();

// router.post(
//   "/create-my-doctor-schedule",
//   CheckAuth(UserRole.DOCTOR),
//   DoctorScheduleController.createMyDoctorSchedule,
// );
// router.get(
//   "/my-doctor-schedules",
//   CheckAuth(UserRole.DOCTOR),
//   DoctorScheduleController.getMyDoctorSchedules,
// );
// router.get(
//   "/",
//   CheckAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
//   DoctorScheduleController.getAllDoctorSchedules,
// );
// router.get(
//   "/:doctorId/schedule/:scheduleId",
//   CheckAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
//   DoctorScheduleController.getDoctorScheduleById,
// );
// router.patch(
//   "/update-my-doctor-schedule",
//   CheckAuth(UserRole.DOCTOR),
//   DoctorScheduleController.updateMyDoctorSchedule,
// );
// router.delete(
//   "/delete-my-doctor-schedule/:id",
//   CheckAuth(UserRole.DOCTOR),
//   DoctorScheduleController.deleteMyDoctorSchedule,
// );

// export const DoctorScheduleRoutes = router;
