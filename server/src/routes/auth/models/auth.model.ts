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
    confirmPassword: z
      .string({ error: "Error.InvalidConfirmPassword" })
      .min(8, { error: "Error.ConfirmPasswordTooShort" })
      .max(128, { error: "Error.ConfirmPasswordTooLong" }),
    code: z.string({ error: "Error.InvalidCode" }).length(6, { error: "Error.CodeInvalidLength" }),
  })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        error: "Error.PasswordsDoNotMatch",
        path: ["confirmPassword"],
      });
    }
  });

export const registerResSchema = userSchema.omit({
  password: true,
  totpSecret: true,
});

export const verificationCodeSchema = z.object({
  id: z.number({ error: "Error.InvalidID" }),
  email: z.email({ error: "Error.InvalidEmail" }),
  code: z.string({ error: "Error.InvalidCode" }).length(6, { error: "Error.CodeInvalidLength" }),
  type: z.enum([TypeOfVerificationCode.REGISTER, TypeOfVerificationCode.FORGOT_PASSWORD], {
    error: "Error.InvalidVerificationType",
  }),
  expiresAt: z.date({ error: "Error.InvalidExpiresAt" }),
  createdAt: z.date({ error: "Error.InvalidCreatedAt" }),
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
  accessToken: z.string({ error: "Error.InvalidAccessToken" }),
  refreshToken: z.string({ error: "Error.InvalidRefreshToken" }),
});

export const refreshTokenBodySchema = z.object({
  refreshToken: z.string({ error: "Error.InvalidRefreshToken" }),
});

export const refreshTokenResSchema = loginResSchema;

export const deviceSchema = z.object({
  id: z.number({ error: "Error.InvalidID" }),
  userId: z.number({ error: "Error.InvalidUserID" }),
  userAgent: z.string({ error: "Error.InvalidUserAgent" }),
  ip: z.string({ error: "Error.InvalidIP" }),
  lastActive: z.date({ error: "Error.InvalidLastActive" }),
  createdAt: z.date({ error: "Error.InvalidCreatedAt" }),
  isActive: z.boolean({ error: "Error.InvalidIsActive" }),
});

export const roleSchema = z.object({
  id: z.number({ error: "Error.InvalidID" }),
  name: z.string({ error: "Error.InvalidName" }),
  description: z.string({ error: "Error.InvalidDescription" }),
  isActive: z.boolean({ error: "Error.InvalidIsActive" }),
  createdById: z.number({ error: "Error.InvalidCreatedByID" }).nullable(),
  updatedById: z.number({ error: "Error.InvalidUpdatedByID" }).nullable(),
  deletedById: z.number({ error: "Error.InvalidDeletedByID" }).nullable(),
  createdAt: z.date({ error: "Error.InvalidCreatedAt" }),
  updatedAt: z.date({ error: "Error.InvalidUpdatedAt" }).nullable(),
  deletedAt: z.date({ error: "Error.InvalidDeletedAt" }).nullable(),
});

export const RefreshTokenSchema = z.object({
  token: z.string({ error: "Error.InvalidToken" }),
  userId: z.number({ error: "Error.InvalidUserID" }),
  deviceId: z.number({ error: "Error.InvalidDeviceID" }),
  expiresAt: z.date({ error: "Error.InvalidExpiresAt" }),
  createdAt: z.date({ error: "Error.InvalidCreatedAt" }),
});

export const logoutBodySchema = refreshTokenBodySchema;

export const googleAuthStateSchema = deviceSchema.pick({
  userAgent: true,
  ip: true,
});

export const getAuthorizationUrlResSchema = z.object({
  url: z.url({ error: "Error.InvalidURL" }),
});

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
export type GoogleAuthStateType = z.infer<typeof googleAuthStateSchema>;
export type GetAuthorizationUrlResType = z.infer<typeof getAuthorizationUrlResSchema>;
