import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterBodyDto, RegisterResDto, SendOTPBodyDto } from "src/routes/auth/dto/auth.dto";
import { ZodSerializerDto } from "nestjs-zod";

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

  // @Post("login")
  // async login(@Body() body: any) {
  //   return await this.authService.login(body);
  // }

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
