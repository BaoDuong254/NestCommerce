import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginBodyDto, RegisterBodyDto, RegisterResDto, SendOTPBodyDto } from "src/routes/auth/dto/auth.dto";
import { ZodSerializerDto } from "nestjs-zod";
import { UserAgent } from "src/shared/decorators/user-agent.decorator";
import { IP } from "src/shared/decorators/ip.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ZodSerializerDto(RegisterResDto)
  async register(@Body() body: RegisterBodyDto) {
    return await this.authService.register(body);
  }

  @Post("otp")
  sendOTP(@Body() body: SendOTPBodyDto) {
    return this.authService.sendOTP(body);
  }

  @Post("login")
  async login(@Body() body: LoginBodyDto, @UserAgent() userAgent: string, @IP() ip: string) {
    return await this.authService.login({
      ...body,
      userAgent,
      ip,
    });
  }

  // @Post("refresh-token")
  // @HttpCode(HttpStatus.OK)
  // async refreshToken(@Body() body: any) {
  //   return await this.authService.refreshToken(body.refreshToken);
  // }

  // @Post("logout")
  // async logout(@Body() body: any) {
  //   return await this.authService.logout(body.refreshToken);
  // }
}
