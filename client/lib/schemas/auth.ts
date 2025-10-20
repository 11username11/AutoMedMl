import * as z from "zod";

export const BaseAuth = z.object({
  email: z.email({ message: "Validation.invalid_email" }),
  password: z
    .string()
    .min(8, { message: "Validation.password_min" })
    .refine((val) => /[a-z]/.test(val), {
      message: "Validation.password_lowercase",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Validation.password_uppercase",
    })
    .refine((val) => /\d/.test(val), {
      message: "Validation.password_number",
    })
    .refine((val) => /[!@#$%^&*?_+\-]/.test(val), {
      message: "Validation.password_special",
    }),
});

export const LoginSchema = BaseAuth.extend({
  remember: z.boolean().optional(),
});

export const RegisterSchema = BaseAuth.extend({
  name: z.string().min(2, { message: "Validation.name_min" }),
  surname: z.string().min(2, { message: "Validation.surname_min" }),
  verification: z.any().array(),
  code: z.string(),
});

export type LoginValues = z.infer<typeof LoginSchema>;
export type RegisterValues = z.infer<typeof RegisterSchema>;
