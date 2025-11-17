import { Controller, Post, Body, Ip, HttpCode, HttpStatus, Get, Query, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  Disable2FABodyDto,
  ForgotPasswordBodyDto,
  GetAuthorizationUrlResDto,
  LoginBodyDto,
  LoginResDto,
  LogoutBodyDto,
  RefreshTokenBodyDto,
  RefreshTokenResDto,
  RegisterBodyDto,
  RegisterResDto,
  SendOTPBodyDto,
  TwoFASetupResDto,
} from "src/routes/auth/dto/auth.dto";
import { ZodSerializerDto } from "nestjs-zod";
import { UserAgent } from "src/shared/decorators/user-agent.decorator";
import { MessageResDto } from "src/shared/dtos/response.dto";
import { IsPublic } from "src/shared/decorators/auth.decorator";
import { GoogleService } from "src/routes/auth/google.service";
import type { Response } from "express";
import envConfig from "src/shared/config";
import { EmptyBodyDto } from "src/shared/dtos/request.dto";
import { ActiveUser } from "src/shared/decorators/active-user.decorator";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleService: GoogleService
  ) {}

  @Post("register")
  @IsPublic()
  @ZodSerializerDto(RegisterResDto)
  async register(@Body() body: RegisterBodyDto) {
    return await this.authService.register(body);
  }

  @Post("otp")
  @IsPublic()
  @ZodSerializerDto(MessageResDto)
  async sendOTP(@Body() body: SendOTPBodyDto) {
    return await this.authService.sendOTP(body);
  }

  @Post("login")
  @IsPublic()
  @ZodSerializerDto(LoginResDto)
  async login(@Body() body: LoginBodyDto, @UserAgent() userAgent: string, @Ip() ip: string) {
    return await this.authService.login({
      ...body,
      userAgent,
      ip,
    });
  }

  @Post("refresh-token")
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(RefreshTokenResDto)
  async refreshToken(@Body() body: RefreshTokenBodyDto, @UserAgent() userAgent: string, @Ip() ip: string) {
    return await this.authService.refreshToken({
      refreshToken: body.refreshToken,
      userAgent,
      ip,
    });
  }

  @Post("logout")
  @ZodSerializerDto(MessageResDto)
  async logout(@Body() body: LogoutBodyDto) {
    return await this.authService.logout(body.refreshToken);
  }

  @Get("google-link")
  @IsPublic()
  @ZodSerializerDto(GetAuthorizationUrlResDto)
  getAuthorizationUrl(@UserAgent() userAgent: string, @Ip() ip: string) {
    return this.googleService.getAuthorizationUrl({
      userAgent,
      ip,
    });
  }

  @Get("google/callback")
  @IsPublic()
  async googleCallback(@Query("code") code: string, @Query("state") state: string, @Res() res: Response) {
    try {
      const data = await this.googleService.googleCallback({ code, state });
      return res.redirect(
        `${envConfig.GOOGLE_CLIENT_REDIRECT_URI}?accessToken=${data.accessToken}&refreshToken=${data.refreshToken}`
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      return res.redirect(`${envConfig.GOOGLE_CLIENT_REDIRECT_URI}?error=${encodeURIComponent(message)}`);
    }
  }

  @Post("forgot-password")
  @IsPublic()
  @ZodSerializerDto(MessageResDto)
  async forgotPassword(@Body() body: ForgotPasswordBodyDto) {
    return await this.authService.forgotPassword(body);
  }

  @Post("2fa/setup")
  @ZodSerializerDto(TwoFASetupResDto)
  setupTwoFactorAuth(@Body() _: EmptyBodyDto, @ActiveUser("userId") userId: number) {
    return this.authService.setupTwoFactorAuth(userId);
  }

  @Post("2fa/disable")
  @ZodSerializerDto(MessageResDto)
  disableTwoFactorAuth(@Body() body: Disable2FABodyDto, @ActiveUser("userId") userId: number) {
    return this.authService.disableTwoFactorAuth({
      ...body,
      userId,
    });
  }
}
