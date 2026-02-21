/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { IErrorSource, TErrorResponse } from "../interface/error.interface";
import { envVars } from "../config/config";
import { handleZodError } from "../helpers/error.helper";

export const globalErrorHandler = (
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

  if (err instanceof z.ZodError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = "Zod validation Error";
    stack = err.stack;
    const simplifyError = handleZodError(err);
    errorSource.push(...simplifyError);
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
