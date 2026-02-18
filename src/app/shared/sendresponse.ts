import { Response } from "express";

type ResponseData<T> = {
  httpStatuscode?: number;
  success: boolean;
  message: string;
  data?: T;
};
const sendResponse = <T>(res: Response, data: ResponseData<T>) => {
  return res.status(data.httpStatuscode || 200).json({
    success: data.success,
    message: data.message,
    data: data.data,
  });
};
export { sendResponse };
