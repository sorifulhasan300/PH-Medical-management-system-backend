/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const globalErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "";

  if (err.name === "ValidationError") {
    statusCode = StatusCodes.BAD_REQUEST;
    message = err.message;
  }
  if (statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
    message = "Internal server error! Please try again later.";
  }
  res.status(statusCode).json({
    success: false,
    message,
  });
};
