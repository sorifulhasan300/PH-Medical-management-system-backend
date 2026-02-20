import { Request, Response } from "express";
import { sendResponse } from "../../shared/sendresponse";
import { userService } from "./user.service";
import { catchAsync } from "../../shared/catchasync";

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const doctor = await userService.createDoctor(req.body);
  console.log("doctor:", doctor);
  sendResponse(res, {
    success: true,
    message: "Doctor created successfully",
    data: doctor,
  });
});

export const userController = {
  createDoctor,
};
