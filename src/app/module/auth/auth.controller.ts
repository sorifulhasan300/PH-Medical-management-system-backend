import { catchAsync } from "../../shared/catchasync";
import { sendResponse } from "../../shared/sendresponse";
import { authService } from "./auth.service";

const registerPatient = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await authService.registerPatient(payload);
  sendResponse(res, {
    success: true,
    message: "Patient registered successfully",
    data: result,
  });
});

const loginPatient = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await authService.loginPatient(payload);
  sendResponse(res, {
    success: true,
    message: "Patient logged in successfully",
    data: result,
  });
});

export const authController = {
  registerPatient,
  loginPatient,
};
