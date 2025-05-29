import { z } from "zod";

export const AuthSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }).max(50, { message: "Password must be at most 50 characters long" }),
});
export const SignupSchema = AuthSchema.extend({
    name: z.string().min(3, { message: "Username must be at least 3 characters long" }).max(50, { message: "Username must be at most 50 characters long" }).regex(/^[a-zA-Z]+$/, { message: "Username can only contain letters" }),
})
