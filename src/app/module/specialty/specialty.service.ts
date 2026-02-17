import { Specialty } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getAllSpecialties = async (): Promise<Specialty[]> => {
  const Specialties = await prisma.specialty.findMany();
  return Specialties;
};
const createSpecialty = async (payload: Specialty): Promise<Specialty[]> => {
  const Specialties = await prisma.specialty.create({
    data: payload,
  });
  return [Specialties];
};
const deleteSpecialty = async (id: string): Promise<Specialty[]> => {
  const Specialties = await prisma.specialty.delete({
    where: { id },
  });
  return [Specialties];
};

const updateSpecialty = async (
  id: string,
  payload: Partial<Specialty>,
): Promise<Specialty[]> => {
  const Specialties = await prisma.specialty.update({
    where: { id },
    data: payload,
  });
  return [Specialties];
};
export const specialtiesService = {
  getAllSpecialties,
  createSpecialty,
  deleteSpecialty,
  updateSpecialty,
};
