import { UserRole } from "../generated/prisma/enums";

export interface RequestUser {
  userId: string;
  role: UserRole;
  email: string;
}
