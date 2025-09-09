import * as z from "zod";

export const BaseAuth = z.object({
  email: z.email({ message: "Invalid email" }),
  password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?_+-])[A-Za-z\d!@#$%^&*]{8,}$/, "Invalid password"),
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