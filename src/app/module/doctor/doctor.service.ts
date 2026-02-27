import { StatusCodes } from "http-status-codes";
import AppError from "../../../error-helper/app.error.helper";
import { Doctor, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import {
  doctorFilterableFields,
  doctorIncludeConfig,
  doctorSearchableFields,
} from "./doctor.constant";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IQueryParams } from "../../../interface/query.interface";

const allDoctors = async (query: IQueryParams) => {
  console.log(query);
  // const doctors = await prisma.doctor.findMany({
  //     where: {
  //         isDeleted: false,
  //     },
  //     include: {
  //         user: true,
  //         specialties: {
  //             include: {
  //                 specialty: true
  //             }
  //         }
  //     }
  // })

  // // const query = new QueryBuilder().paginate().search().filter();
  // return doctors;

  const queryBuilder = new QueryBuilder<
    Doctor,
    Prisma.DoctorWhereInput,
    Prisma.DoctorInclude
  >(prisma.doctor, query, {
    searchableFields: doctorSearchableFields,
    filterableFields: doctorFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .where({
      isDeleted: false,
    })
    .include({
      user: true,
      // specialties: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
    })
    .dynamicInclude(doctorIncludeConfig)
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};
const doctorById = async ({ id }: { id: string }) => {
  const doctorExist = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });
  if (!doctorExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Doctor not found");
  }
  const doctor = await prisma.doctor.findUnique({
    where: {
      id,
    },
    include: {
      specialties: true,
      user: true,
    },
  });
  return doctor;
};

const updateDoctor = async ({
  payload,
  id,
}: {
  payload: Partial<Doctor>;
  id: string;
}) => {
  const doctorExist = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });
  if (!doctorExist) {
    throw new Error("Doctor not found");
  }
  const doctor = await prisma.doctor.update({
    where: {
      id,
    },
    data: payload,
  });
  return doctor;
};

const softDeleteDoctor = async ({ id }: { id: string }) => {
  const doctorExist = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });
  if (!doctorExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Doctor not found");
  }
  const doctor = await prisma.doctor.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
  return doctor;
};

export const doctorService = {
  allDoctors,
  updateDoctor,
  softDeleteDoctor,
  doctorById,
};
