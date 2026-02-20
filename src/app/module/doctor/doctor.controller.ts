import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchasync";
import { doctorService } from "./doctor.service";
import { sendResponse } from "../../shared/sendresponse";
import { StatusCodes } from "http-status-codes";

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
  const doctors = await doctorService.allDoctors();
  sendResponse(res, {
    httpStatuscode: StatusCodes.OK,
    success: true,
    message: "Doctors retrieved successfully",
    data: doctors,
  });
});
const doctorById = catchAsync(async (req: Request, res: Response) => {
  const doctors = await doctorService.doctorById({
    id: req.params.id as string,
  });
  sendResponse(res, {
    httpStatuscode: StatusCodes.OK,
    success: true,
    message: "Doctor retrieved successfully",
    data: doctors,
  });
});
const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const doctors = await doctorService.updateDoctor({
    payload: req.body,
    id: req.params.id as string,
  });
  sendResponse(res, {
    httpStatuscode: StatusCodes.OK,
    success: true,
    message: "Doctor updated successfully",
    data: doctors,
  });
});

const softDeleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const doctors = await doctorService.softDeleteDoctor({
    id: req.params.id as string,
  });
  sendResponse(res, {
    httpStatuscode: StatusCodes.OK,
    success: true,
    message: "Doctor soft deleted successfully",
    data: doctors,
  });
});
export const doctorController = {
  getAllDoctors,
  updateDoctor,
  softDeleteDoctor,
  doctorById,
};
