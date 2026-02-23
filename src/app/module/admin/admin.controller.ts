import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchasync";
import { sendResponse } from "../../shared/sendresponse";
import { StatusCodes } from "http-status-codes";
import { adminService } from "./admin.service";

const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
  const admin = await adminService.getAllAdmin();
  sendResponse(res, {
    httpStatuscode: StatusCodes.OK,
    success: true,
    message: "Admin retrieved successfully",
    data: admin,
  });
});
const adminById = catchAsync(async (req: Request, res: Response) => {
  const admin = await adminService.adminById({
    id: req.params.id as string,
  });
  sendResponse(res, {
    httpStatuscode: StatusCodes.OK,
    success: true,
    message: "Admin retrieved successfully",
    data: admin,
  });
});
const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const doctors = await adminService.updateAdmin({
    payload: req.body,
    id: req.params.id as string,
  });
  sendResponse(res, {
    httpStatuscode: StatusCodes.OK,
    success: true,
    message: "Admin updated successfully",
    data: doctors,
  });
});

const softDeleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const doctors = await adminService.softDeleteAdmin({
    id: req.params.id as string,
  });
  sendResponse(res, {
    httpStatuscode: StatusCodes.OK,
    success: true,
    message: "Doctor soft deleted successfully",
    data: doctors,
  });
});
export const adminController = {
  getAllAdmin,
  updateAdmin,
  softDeleteAdmin,
  adminById,
};
