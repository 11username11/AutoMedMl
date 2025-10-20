import z from "zod";
import { GENDER, STATUS } from "../constants";
import { parse } from "date-fns";

export const PatientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Validation.name_min" })
    .regex(/^\p{L}+$/u, { message: "Validation.name_letters_only" }),

  surname: z
    .string()
    .trim()
    .min(2, { message: "Validation.surname_min" })
    .regex(/^\p{L}+$/u, { message: "Validation.surname_letters_only" }),

  email: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: "Validation.email_invalid",
    }),

  phone: z
    .string()
    .transform((val) => val.replace(/\s+/g, ""))
    .optional(),

  date_of_birth: z.string().refine((val) => {
    const parsed = parse(val, "dd.MM.yyyy", new Date());
    if (isNaN(parsed.getTime())) return false;

    const currentYear = new Date().getFullYear();
    return parsed.getFullYear() <= currentYear && parsed.getFullYear() >= 1925;
  }, {
    message: "Validation.date_invalid",
  }),

  gender: z.enum(GENDER, {
    message: "Validation.gender_required",
  }),
  status: z.enum(STATUS, {
    message: "Validation.status_required",
  }),

  medical_history: z.string().optional(),
});
