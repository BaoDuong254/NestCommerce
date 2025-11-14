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
  .extend({
    confirmPassword: z.string().min(8).max(128),
    code: z.string().length(6),
  })
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

export const registerResSchema = userSchema.omit({
  password: true,
  totpSecret: true,
});

export const verificationCodeSchema = z.object({
  id: z.number(),
  email: z.email(),
  code: z.string().length(6),
  type: z.enum([TypeOfVerificationCode.REGISTER, TypeOfVerificationCode.FORGOT_PASSWORD]),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export const sendOTPBodySchema = verificationCodeSchema
  .pick({
    email: true,
    type: true,
  })
  .strict();

export const loginBodySchema = userSchema
  .pick({
    email: true,
    password: true,
  })
  .strict();

export const loginResSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const refreshTokenBodySchema = z.object({
  refreshToken: z.string(),
});

export const refreshTokenResSchema = loginResSchema;

export const deviceSchema = z.object({
  id: z.number(),
  userId: z.number(),
  userAgent: z.string(),
  ip: z.string(),
  lastActive: z.date(),
  createdAt: z.date(),
  isActive: z.boolean(),
});

export const roleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  isActive: z.boolean(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  deletedAt: z.date().nullable(),
});

export const RefreshTokenSchema = z.object({
  token: z.string(),
  userId: z.number(),
  deviceId: z.number(),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export const logoutBodySchema = refreshTokenBodySchema;

export type RoleType = z.infer<typeof roleSchema>;
export type RegisterBodyType = z.infer<typeof registerBodySchema>;
export type RegisterResType = z.infer<typeof registerResSchema>;
export type VerificationCodeType = z.infer<typeof verificationCodeSchema>;
export type SendOTPBodyType = z.infer<typeof sendOTPBodySchema>;
export type LoginBodyType = z.infer<typeof loginBodySchema>;
export type LoginResType = z.infer<typeof loginResSchema>;
export type RefreshTokenBodyType = z.infer<typeof refreshTokenBodySchema>;
export type RefreshTokenResType = z.infer<typeof refreshTokenResSchema>;
export type DeviceType = z.infer<typeof deviceSchema>;
export type RefreshTokenType = z.infer<typeof RefreshTokenSchema>;
export type LogoutBodyType = z.infer<typeof logoutBodySchema>;
