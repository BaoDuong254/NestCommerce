import { createZodDto } from "nestjs-zod";
import {
  ForgotPasswordBodySchema,
  getAuthorizationUrlResSchema,
  loginBodySchema,
  loginResSchema,
  logoutBodySchema,
  refreshTokenBodySchema,
  refreshTokenResSchema,
  registerBodySchema,
  registerResSchema,
  sendOTPBodySchema,
} from "src/routes/auth/models/auth.model";

export class RegisterBodyDto extends createZodDto(registerBodySchema) {}
export class RegisterResDto extends createZodDto(registerResSchema) {}
export class SendOTPBodyDto extends createZodDto(sendOTPBodySchema) {}
export class LoginBodyDto extends createZodDto(loginBodySchema) {}
export class LoginResDto extends createZodDto(loginResSchema) {}
export class RefreshTokenBodyDto extends createZodDto(refreshTokenBodySchema) {}
export class RefreshTokenResDto extends createZodDto(refreshTokenResSchema) {}
export class LogoutBodyDto extends createZodDto(logoutBodySchema) {}
export class GetAuthorizationUrlResDto extends createZodDto(getAuthorizationUrlResSchema) {}
export class ForgotPasswordBodyDto extends createZodDto(ForgotPasswordBodySchema) {}
