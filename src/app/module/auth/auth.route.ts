import { Router } from "express";
import { authController } from "./auth.controller";

const route = Router();
route.post("/register", authController.registerPatient);
route.post("/login", authController.loginPatient);
route.post("/refresh-token", authController.getNewToken);
export const AuthRoute = route;
