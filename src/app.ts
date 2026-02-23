import express, { Application, Request, Response } from "express";
import { apiRouter } from "./routers";
import { globalErrorHandler } from "./middleware/global-error-handler";
import { NotFoundMiddleware } from "./middleware/not-found";
import cookieParser from "cookie-parser";
const app: Application = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
// Use API routes
app.use("/api/v1", apiRouter);
app.use(globalErrorHandler);
app.use(NotFoundMiddleware);
//this is testing
// Test route to create a specialty and return it
app.get("/", async (req: Request, res: Response) => {
  return res.json({ message: "Welcome to the Healthcare API" });
});

export default app;
