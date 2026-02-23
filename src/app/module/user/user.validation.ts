import z from "zod";

export const doctorSchema = z.object({
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters long"),
  doctor: z.object({
    name: z
      .string("Name is required")
      .min(3, "Name must be at least 3 characters long"),
    email: z.email("Email is required"),

    profilePhoto: z.url("Profile photo URL is required"),
    contactNumber: z
      .string("Contact number is required")
      .min(10, "Contact number must be at least 10 digits long")
      .optional(),
    registrationNumber: z
      .string("Registration number is required")
      .min(5, "Registration number must be at least 5 characters long")
      .optional(),
    experience: z
      .number("Experience is required")
      .min(0, "Experience must be a non-negative number")
      .optional(),
    gender: z
      .enum(
        ["MALE", "FEMALE"],
        "Gender is required and must be one of 'MALE', 'FEMALE'",
      )
      .optional(),
    address: z
      .string("Address is required")
      .min(5, "Address must be at least 5 characters long")
      .optional(),
    appointmentFee: z
      .number("Appointment fee is required")
      .min(0, "Appointment fee must be a non-negative number")
      .optional(),
    qualification: z
      .string("Qualification is required")
      .min(5, "Qualification must be at least 5 characters long")
      .optional(),
    currentWorkplace: z
      .string("Current workplace is required")
      .min(5, "Current workplace must be at least 5 characters long")
      .optional(),
    designation: z
      .string("Designation is required")
      .min(5, "Designation must be at least 5 characters long")
      .optional(),
  }),
  specialties: z
    .array(z.uuid("Specialty ID is required"))
    .min(1, "At least one specialty is required"),
});

export const adminSchema = z.object({
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters"),

  admin: z.object({
    name: z.string("Name is required"),
    email: z.email("Email is required"),

    profilePhoto: z.url("Invalid photo URL").optional(),

    contactNumber: z.string("Contact number is required"),

    gender: z
      .enum(
        ["MALE", "FEMALE"],
        "Gender is required and must be one of 'MALE', 'FEMALE'",
      )
      .optional(),

    address: z.string().optional(),
  }),
});

export const SuperAdminSchema = z.object({
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters"),

  superAdmin: z.object({
    name: z.string("Name is required"),
    email: z.email("Email is required"),

    profilePhoto: z.url("Invalid photo URL").optional(),

    contactNumber: z.string("Contact number is required"),

    gender: z
      .enum(
        ["MALE", "FEMALE"],
        "Gender is required and must be one of 'MALE', 'FEMALE'",
      )
      .optional(),

    address: z.string().optional(),
  }),
});
