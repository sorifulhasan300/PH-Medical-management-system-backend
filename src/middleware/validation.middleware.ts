import { NextFunction, Request, Response } from "express";
import z from "zod";

const validationMiddleware = (schema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const parseResult = schema.safeParse(req.body);
    console.log(parseResult);
    if (!parseResult.success) {
      next(parseResult.error);
      return;
    }
    req.body = parseResult.data;
    next();
  };
};

export default validationMiddleware;
