import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchasync";
import { sendResponse } from "../../shared/sendresponse";
import { StatusCodes } from "http-status-codes";
import { IQueryParams } from "../../../interface/query.interface";
import { ScheduleService } from "./schedule.service";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const schedule = await ScheduleService.createSchedule(payload);
  sendResponse(res, {
    success: true,
    httpStatuscode: StatusCodes.CREATED,
    message: "Schedule created successfully",
    data: schedule,
  });
});

const getAllSchedules = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await ScheduleService.getAllSchedules(query as IQueryParams);
  sendResponse(res, {
    success: true,
    httpStatuscode: StatusCodes.OK,
    message: "Schedules retrieved successfully",
    data: result.data,
  });
});

const getScheduleById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const schedule = await ScheduleService.getScheduleById(id as string);
  sendResponse(res, {
    success: true,
    httpStatuscode: StatusCodes.OK,
    message: "Schedule retrieved successfully",
    data: schedule,
  });
});

const updateSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const updatedSchedule = await ScheduleService.updateSchedule(
    id as string,
    payload,
  );
  sendResponse(res, {
    success: true,
    httpStatuscode: StatusCodes.OK,
    message: "Schedule updated successfully",
    data: updatedSchedule,
  });
});

const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await ScheduleService.deleteSchedule(id as string);
  sendResponse(res, {
    success: true,
    httpStatuscode: StatusCodes.OK,
    message: "Schedule deleted successfully",
  });
});

export const ScheduleController = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};
