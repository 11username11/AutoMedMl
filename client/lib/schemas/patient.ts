import z from "zod"
import { GENDER, STATUS } from "../constants"
import { parse } from "date-fns"

export const PatientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long" })
    .regex(/^\p{L}+$/u, { message: "Name can only contain letters" }),

  surname: z
    .string()
    .trim()
    .min(2, { message: "Surname must be at least 2 characters long" })
    .regex(/^\p{L}+$/u, { message: "Surname can only contain letters" }),

  email: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || z.email().safeParse(val).success, {
      message: "Please enter a valid email address",
    }),

  phone: z
    .string()
    .transform((val) => val.replace(/\s+/g, ""))
    .optional(),

  date_of_birth: z.string().refine((val) => {
    const parsed = parse(val, "dd.MM.yyyy", new Date())
    if (isNaN(parsed.getTime())) return false

    const currentYear = new Date().getFullYear()
    return parsed.getFullYear() <= currentYear && parsed.getFullYear() >= 1925
  }, {
    message: "Invalid date",
  }),
    
  gender: z.enum(GENDER, {
    message: "Please select a gender",

  }),
  status: z.enum(STATUS, {
    message: "Please select a status",
  }),

  medical_history: z.string().optional(),
})