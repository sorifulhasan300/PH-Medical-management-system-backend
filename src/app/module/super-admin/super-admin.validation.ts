import z from "zod";

export const SuperAdminUpdateSchema = z.object({
  name: z.string("Name is required").optional(),
  profilePhoto: z.url("Invalid photo URL").optional(),
  contactNumber: z.string("Contact number is required").optional(),
  gender: z
    .enum(
      ["MALE", "FEMALE"],
      "Gender is required and must be one of 'MALE', 'FEMALE'",
    )
    .optional(),

  address: z.string().optional(),
});
