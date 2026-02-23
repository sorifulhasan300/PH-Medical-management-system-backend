import { RequestUser } from "./requestUser.interface";

declare global {
  namespace Express {
    interface Request {
      user: RequestUser;
    }
  }
}
