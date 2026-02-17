import express, { Application, Request, Response } from "express";
import { apiRouter } from "./routers";

const app: Application = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Use API routes
app.use("/api/v1", apiRouter);

// Test route to create a specialty and return it
app.get("/", async (req: Request, res: Response) => {
  return res.json({ message: "Welcome to the Healthcare API" });
});

export default app;
