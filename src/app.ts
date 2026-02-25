import express, { Application, Request, Response } from "express";
import { apiRouter } from "./routers";
import { globalErrorHandler } from "./middleware/global-error-handler";
import { NotFoundMiddleware } from "./middleware/not-found";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "path";
import cors from "cors";
import { envVars } from "./config/config";
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
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
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
