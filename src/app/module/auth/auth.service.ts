/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

interface RegisterPatientPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPatientPayload {
  email: string;
  password: string;
}
const registerPatient = async (payload: RegisterPatientPayload) => {
  const { name, email, password } = payload;
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      role: "PATIENT",
    },
  });
  if (!data) {
    throw new Error("Failed to register patient");
  }

  const patient = await prisma.$transaction(async (tx) => {
    try {
      const createPatient = await tx.patient.create({
        data: {
          userId: data.user.id,
          name: payload.name,
          email: payload.email,
        },
      });
      return createPatient;
    } catch (error) {
      await prisma.user.delete({
        where: { id: data.user.id },
      });
      throw error;
    }
  });

  return {
    ...data,
    patient,
  };
};

const loginPatient = async (payload: LoginPatientPayload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({ body: { email, password } });
  if (!data) {
    throw new Error("Failed to login patient");
  }
  if (data.user.status === UserStatus.BLOCKED) {
    throw new Error("Patient is blocked");
  }

  if (data.user.isDeleted) {
    throw new Error("Patient is deleted");
  }
  return data;
};

export const authService = {
  registerPatient,
  loginPatient,
};
