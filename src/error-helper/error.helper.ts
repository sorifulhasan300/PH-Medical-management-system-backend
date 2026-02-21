import z from "zod";
import { IErrorSource } from "../interface/error.interface";

export const handleZodError = (error: z.ZodError) => {
  const errorSource: IErrorSource[] = [];
  error.issues.forEach((issue) => {
    errorSource.push({
      path: issue.path.join(" "),
      message: issue.message,
    });
  });
  return errorSource;
};
