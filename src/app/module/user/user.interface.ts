import { Gender } from "../../../generated/prisma/enums";

export interface DoctorPayload {
  password: string;
  doctor: {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber?: string;
    registrationNumber?: string;
    experience?: number;
    gender?: string;
    address?: string;
    appointmentFee?: number;
    qualification?: string;
    currentWorkplace?: string;
    designation?: string;
    averageRating?: number;
    isDeleted?: boolean;
    deletedAt?: Date;
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
