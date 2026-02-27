import { Gender } from "../../../generated/prisma/enums";

export interface DoctorPayload {
  password: string;
  doctor: {
    name: string;
    email: string;
    registrationNumber: string;
    gender: "MALE" | "FEMALE" | "OTHER"; 
    appointmentFee: number;
    qualification: string;
    currentWorkingPlace: string; 
    designation: string;
    userId: string; 
    id?: string; 
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
    experience?: number;
    averageRating?: number;
    isDeleted?: boolean;
    deletedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  };
  specialties: string[];
}

export interface AdminPayload {
  password: string;
  admin: {
    name: string;
    email: string;
    profilePhoto?: string | undefined;
    contactNumber: string;
    gender: Gender;
    address?: string | undefined;
  };
}
export interface SuperAdminPayload {
  password: string;
  superAdmin: {
    name: string;
    email: string;
    profilePhoto?: string | undefined;
    contactNumber: string;
    gender: Gender;
    address?: string | undefined;
  };
}
