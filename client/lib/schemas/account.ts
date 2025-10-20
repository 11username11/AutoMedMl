import { BaseAuth } from './auth';
import z from "zod";

export const UserSchema = BaseAuth.extend({
  name: z.string().min(1, { message: "Validation.name_required" }),
  surname: z.string().min(1, { message: "Validation.surname_required" }),
  email: z.email({ message: "Validation.invalid_email" }),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: "Validation.password_required_length",
    })
    .refine((val) => !val || /[A-Z]/.test(val), {
      message: "Validation.password_required_uppercase",
    })
    .refine((val) => !val || /[a-z]/.test(val), {
      message: "Validation.password_required_lowercase",
    })
    .refine((val) => !val || /\d/.test(val), {
      message: "Validation.password_required_digit",
    })
    .refine((val) => !val || /[!@#$%^&*?_+-]/.test(val), {
      message: "Validation.password_required_special",
    }),
});
