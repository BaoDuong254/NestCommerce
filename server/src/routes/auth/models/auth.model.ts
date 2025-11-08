import { TypeOfVerificationCode, UserStatus } from "src/shared/constants/auth.constant";
import z from "zod";

export const userSchema = z.object({
  id: z.number(),
  email: z.email(),
  name: z.string().min(1).max(100),
  password: z.string().min(8).max(128),
  phoneNumber: z.string().min(10).max(15),
  avatar: z.string().nullable(),
  totpSecret: z.string().nullable(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BLOCKED]),
  roleId: z.number().positive(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type UserType = z.infer<typeof userSchema>;

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
