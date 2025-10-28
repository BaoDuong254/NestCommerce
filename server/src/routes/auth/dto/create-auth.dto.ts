import { Exclude, Type } from "class-transformer";
import { IsEmail, IsString, Length } from "class-validator";
import { Match } from "src/shared/decorators/custom-validator.decorator";
import { SuccessRes } from "src/shared/shared.dto";

export class LoginBody {
  @IsEmail()
  email: string;
  @IsString()
  @Length(6, 20, { message: "Mật khẩu phải từ 6 đến 20 ký tự" })
  password: string;
}

export class LoginRes {
  accessToken: string;
  refreshToken: string;

  constructor(partial: Partial<LoginRes>) {
    Object.assign(this, partial);
  }
}

export class RegisterBody extends LoginBody {
  @IsString()
  name: string;
  @IsString()
  @Match("password", { message: "Mật khẩu không khớp" })
  confirmPassword: string;
}

class RegisterData {
  id: number;
  email: string;
  name: string;
  @Exclude() password: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<RegisterData>) {
    Object.assign(this, partial);
  }
}

export class RegisterRes extends SuccessRes {
  @Type(() => RegisterData)
  declare data: RegisterData;

  constructor(partial: Partial<RegisterRes>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export class RefreshTokenBodyDTO {
  @IsString()
  refreshToken: string;
}

export class RefreshTokenResDTO extends LoginRes {}

export class LogoutBodyDTO extends RefreshTokenBodyDTO {}

export class LogoutResDTO {
  message: string;
  constructor(partial: Partial<LogoutResDTO>) {
    Object.assign(this, partial);
  }
}
