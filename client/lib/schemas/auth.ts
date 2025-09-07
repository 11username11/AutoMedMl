import * as z from "zod";

export const BaseAuth = z.object({
  email: z.email({ message: "Invalid email" }),
  password: z.string().min(8, { message: "Password too short" }),
});

export const LoginSchema = z.object({
  email: z.email({ message: "Invalid email" }),
  password: z.string().min(8, { message: "Password too short" }),
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