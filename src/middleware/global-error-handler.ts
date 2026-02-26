/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import z, { promise } from "zod";
import { IErrorSource, TErrorResponse } from "../interface/error.interface";
import { envVars } from "../config/config";
import { handleZodError } from "../error-helper/error.helper";
import AppError from "../error-helper/app.error.helper";
import { deleteFileFromCloudinary } from "../config/cloudinary.config";

export const globalErrorHandler = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "";
  const errorSource: IErrorSource[] = [];
  let stack = err.stack;
  if (err.name === "ValidationError") {
    statusCode = StatusCodes.BAD_REQUEST;
    message = err.message;
  }
  if (req.file) {
    await deleteFileFromCloudinary(req.file.path);
  }
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const imageUrls = req.files.map((file) => file.path);
    await Promise.all(imageUrls.map((url) => deleteFileFromCloudinary(url)));
  }
  if (err instanceof z.ZodError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = "Zod validation Error";
    stack = err.stack;
    const simplifyError = handleZodError(err);
    errorSource.push(...simplifyError);
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
  } else if (err instanceof Error) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
  }

  const errorResponse: TErrorResponse = {
    success: false,
    message,
    error: envVars.NODE_ENV === "development" ? err : undefined,
    errorSource,
    stack: envVars.NODE_ENV === "development" ? stack : undefined,
  };
  res.status(statusCode).json(errorResponse);
};
