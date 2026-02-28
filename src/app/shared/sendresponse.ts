import { Response } from "express";
export type IMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage?: number;
};
type ResponseData<T> = {
  httpStatuscode?: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: IMeta;
};
const sendResponse = <T>(res: Response, data: ResponseData<T>) => {
  return res.status(data.httpStatuscode || 200).json({
    success: data.success,
    message: data.message,
    data: data.data,
  });
};
export { sendResponse };
