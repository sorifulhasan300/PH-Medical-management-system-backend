import { StatusCodes } from "http-status-codes";
import app from "./app";
import { envVars } from "./config/config";
import AppError from "./error-helper/app.error.helper";
const bootstrap = () => {
  try {
    app.listen(envVars.PORT, () => {
      console.log(`Server is running on http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    throw new AppError(StatusCodes.NOT_FOUND, `Error Express Server ${error}`);
  }
};

bootstrap();
