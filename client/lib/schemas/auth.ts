import * as z from "zod";

export const BaseAuth = z.object({
  email: z.email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password must contain at least one number",
    })
    .refine((val) => /[!@#$%^&*?_+\-]/.test(val), {
      message: "Password must contain a special character: !@#$%^&*",
    }),
});

export const LoginSchema = BaseAuth.extend({
  remember: z.boolean().optional()
});

export const RegisterSchema = BaseAuth.extend({
  name: z.string().min(2),
  surname: z.string().min(2),
  verification: z.file().array(),
  code: z.string(),
});

export type LoginValues = z.infer<typeof LoginSchema>;
export type RegisterValues = z.infer<typeof RegisterSchema>;