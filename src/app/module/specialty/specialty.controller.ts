/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { specialtiesService } from "./specialty.service";
import { catchAsync } from "../../shared/catchasync";
import { sendResponse } from "../../shared/sendresponse";

const getAllSpecialties = catchAsync(async (req: Request, res: Response) => {
  const specialties = await specialtiesService.getAllSpecialties();
  sendResponse(res, {
    success: true,
    message: "Specialties retrieved successfully",
    data: specialties,
  });
});

const createSpecialty = catchAsync(async (req: Request, res: Response) => {
  const specialties = await specialtiesService.createSpecialty(req.body);
  sendResponse(res, {
    success: true,
    message: "Specialty created successfully",
    data: specialties,
  });
});

const deleteSpecialty = catchAsync(async (req: Request, res: Response) => {
  await specialtiesService.deleteSpecialty(req.params.id as string);
  sendResponse(res, {
    success: true,
    message: "Specialty deleted successfully",
  });
});

const updateSpecialty = catchAsync(async (req: Request, res: Response) => {
  const specialties = await specialtiesService.updateSpecialty(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    success: true,
    message: "Specialty updated successfully",
    data: specialties,
  });
});

export const specialtiesController = {
  getAllSpecialties,
  createSpecialty,
  deleteSpecialty,
  updateSpecialty,
};
