/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, Request, Response } from "express";
import { apiRouter } from "./routers";
import { globalErrorHandler } from "./middleware/global-error-handler";
import { NotFoundMiddleware } from "./middleware/not-found";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "path";
import cors from "cors";
import cron from "node-cron";

import { envVars } from "./config/config";
import { AppointmentService } from "./app/module/appointment/appointment.service";
const app: Application = express();
const corsOptions = {
  origin: [
    envVars.BETTER_AUTH_URL,
    envVars.FRONTEND_URL,
    "http://localhost:5000",
    "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    console.log("webhook received", req.body);
    res.status(200).json({ received: true });
  },
);
cron.schedule("*/25 * * * *", async () => {
  try {
    console.log("Running cron job to cancel unpaid appointments...");
    await AppointmentService.cancelUnpaidAppointments();
  } catch (error: any) {
    console.error(
      "Error occurred while canceling unpaid appointments:",
      error.message,
    );
  }
});
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// Use API routes
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`));
app.use("/api/auth", toNodeHandler(auth));
app.use("/api/v1", apiRouter);
app.use(globalErrorHandler);
app.use(NotFoundMiddleware);
//this is testing
// Test route to create a specialty and return it
// Test route to create a specialty and return it

app.get("/", async (req: Request, res: Response) => {
  return res.json({ message: "Welcome to the Healthcare API" });
});

export default app;
