import {
  DoctorSchedules,
  Prisma,
  User,
} from "../../../generated/prisma/client";
import { IQueryParams } from "../../../interface/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import {
  doctorScheduleFilterableFields,
  doctorScheduleIncludeConfig,
  doctorScheduleSearchableFields,
} from "./doctorSchedule.constant";
import { ICreateDoctorSchedulePayload } from "./doctorSchedule.interface";

const createMyDoctorSchedule = async (
  user: User,
  payload: ICreateDoctorSchedulePayload,
) => {
  const doctor = await prisma.doctor.findFirstOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctor.id,
    scheduleId,
  }));

  await prisma.doctorSchedules.createMany({
    data: doctorScheduleData,
  });

  const result = await prisma.doctorSchedules.findMany({
    where: {
      doctorId: doctor.id,
      scheduleId: {
        in: payload.scheduleIds,
      },
    },
    include: {
      schedule: true,
    },
  });
  return result;
};
const getMyDoctorSchedules = async (user: User, query: IQueryParams) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const queryBuilder = new QueryBuilder<
    DoctorSchedules,
    Prisma.DoctorSchedulesWhereInput,
    Prisma.DoctorSchedulesInclude
  >(
    prisma.doctorSchedules,
    {
      doctorId: doctorData.id,
      ...query,
    },
    {
      filterableFields: doctorScheduleFilterableFields,
      searchableFields: doctorScheduleSearchableFields,
    },
  );
  const doctorSchedules = await queryBuilder
    .search()
    .filter()
    .paginate()
    .include({
      schedule: true,
      doctor: {
        include: {
          user: true,
        },
      },
    })
    .sort()
    .fields()
    .dynamicInclude(doctorScheduleIncludeConfig)
    .execute();
  return doctorSchedules;
};
export const DoctorScheduleService = {
  createMyDoctorSchedule,
  //   getAllDoctorSchedules,
  //   getDoctorScheduleById,
  //   updateMyDoctorSchedule,
  //   deleteMyDoctorSchedule,
  getMyDoctorSchedules,
};
