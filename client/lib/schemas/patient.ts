import z from "zod"
import { GENDER, STATUS } from "../constants"

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
    .trim()
    .transform((val) => val.replace(/\s+/g, ""))
    .optional()
    .refine(
      (val) => !val || /^\+?\d{10,15}$/.test(val),
      { message: "Phone number must be 10–15 digits (with optional +)" }
    ),

  age: z
    .number()
    .min(1, { message: "Age is required" })
    .refine((val) => {
      const num = Number(val)
      return !isNaN(num) && num >= 0 && num <= 150
    }, { message: "Age must be a number between 0 and 150" }),

  gender: z.enum(GENDER, {
    message: "Please select a gender",

  }),
  status: z.enum(STATUS, {
    message: "Please select a status",
  }),

  medical_history: z.string().optional(),
})