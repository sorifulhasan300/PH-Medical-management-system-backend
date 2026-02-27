import { Request, Response } from "express";
import { sendResponse } from "../../shared/sendresponse";
import { userService } from "./user.service";
import { catchAsync } from "../../shared/catchasync";

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);
  const doctor = await userService.createDoctor(req.body);
  console.log("doctor:", doctor);
  sendResponse(res, {
    success: true,
    message: "Doctor created successfully",
    data: doctor,
  });
});
const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const admin = await userService.createAdmin(req.body);
  sendResponse(res, {
    success: true,
    message: "Admin created successfully",
    data: admin,
  });
});
const createSuperAdmin = catchAsync(async (req: Request, res: Response) => {
  const superAdmin = await userService.createSuperAdmin(req.body);
  sendResponse(res, {
    success: true,
    message: "Super Admin created successfully",
    data: superAdmin,
  });
});
const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const superAdmin = await userService.getMe(user);
  sendResponse(res, {
    success: true,
    message: "Get profile successfully",
    data: superAdmin,
  });
});
export const userController = {
  createDoctor,
  createAdmin,
  createSuperAdmin,
  getMe,
};
