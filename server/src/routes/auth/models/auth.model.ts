import { TypeOfVerificationCode } from "src/shared/constants/auth.constant";
import { userSchema } from "src/shared/models/shared-user.model";
import z from "zod";

export const registerBodySchema = userSchema
  .pick({
    email: true,
    password: true,
    name: true,
    phoneNumber: true,
  })
  .extend({ confirmPassword: z.string().min(8).max(128) })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });
export type RegisterBodyType = z.infer<typeof registerBodySchema>;

export const registerResSchema = userSchema.omit({
  password: true,
  totpSecret: true,
});
export type RegisterResType = z.infer<typeof registerResSchema>;

export const verificationCode = z.object({
  id: z.number(),
  email: z.email(),
  code: z.string().length(6),
  type: z.enum([TypeOfVerificationCode.REGISTER, TypeOfVerificationCode.FORGOT_PASSWORD]),
  expiresAt: z.date(),
  createdAt: z.date(),
});
export type VerificationCodeType = z.infer<typeof verificationCode>;

export const sendOTPBodySchema = verificationCode
  .pick({
    email: true,
    type: true,
  })
  .strict();
export type SendOTPBodyType = z.infer<typeof sendOTPBodySchema>;
