import z from "zod";

const specialtySchema = z.object({
  title: z.string("Title is required"),
});
export const SpecialtyValidation = {
  specialtySchema,
};
