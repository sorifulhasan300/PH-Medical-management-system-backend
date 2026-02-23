import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchasync";
import { sendResponse } from "../../shared/sendresponse";
import { StatusCodes } from "http-status-codes";
import { superAdminService } from "./super-admin.service";

const getAllSuperAdmin = catchAsync(async (req: Request, res: Response) => {
  const admin = await superAdminService.getAllSuperAdmin();
  sendResponse(res, {
    httpStatuscode: StatusCodes.OK,
    success: true,
    message: "Super Admin retrieved successfully",
    data: admin,
  });
});
const superAdminById = catchAsync(async (req: Request, res: Response) => {
  const superAdmin = await superAdminService.superAdminById({
    id: req.params.id as string,
  });
  sendResponse(res, {
    httpStatuscode: StatusCodes.OK,
    success: true,
    message: "Super Admin retrieved successfully",
    data: superAdmin,
  });
});
const updateSuperAdmin = catchAsync(async (req: Request, res: Response) => {
  const superAdmin = await superAdminService.updateSuperAdmin({
    payload: req.body,
    id: req.params.id as string,
  });
  sendResponse(res, {
    httpStatuscode: StatusCodes.OK,
    success: true,
    message: "Super Admin updated successfully",
    data: superAdmin,
  });
});

const softDeleteSuperAdmin = catchAsync(async (req: Request, res: Response) => {
  const superAdmin = await superAdminService.softDeleteSuperAdmin({
    id: req.params.id as string,
  });
  sendResponse(res, {
    httpStatuscode: StatusCodes.OK,
    success: true,
    message: "Super Admin soft deleted successfully",
    data: superAdmin,
  });
});
export const SuperAdminController = {
  getAllSuperAdmin,
  updateSuperAdmin,
  softDeleteSuperAdmin,
  superAdminById,
};
