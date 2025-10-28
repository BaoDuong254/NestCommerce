import { Controller, Get, Post, Body, Patch, Param, Delete, SerializeOptions } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import {
  LoginBody,
  LoginRes,
  LogoutBodyDTO,
  LogoutResDTO,
  RefreshTokenBodyDTO,
  RefreshTokenResDTO,
  RegisterBody,
  RegisterRes,
} from "src/routes/auth/dto/create-auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SerializeOptions({ type: RegisterRes })
  @Post("register")
  async register(@Body() body: RegisterBody) {
    return await this.authService.register(body);
  }

  @Post("login")
  async login(@Body() body: LoginBody) {
    return new LoginRes(await this.authService.login(body));
  }

  @Post("refresh-token")
  async refreshToken(@Body() body: RefreshTokenBodyDTO) {
    return new RefreshTokenResDTO(await this.authService.refreshToken(body.refreshToken));
  }

  @Post("logout")
  async logout(@Body() body: LogoutBodyDTO) {
    return new LogoutResDTO(await this.authService.logout(body.refreshToken));
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.authService.remove(+id);
  }
}
