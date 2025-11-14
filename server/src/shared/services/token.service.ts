import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import ms, { StringValue } from "ms";
import envConfig from "src/shared/config";
import {
  AccessTokenPayload,
  AccessTokenPayloadCreate,
  RefreshTokenPayload,
  RefreshTokenPayloadCreate,
} from "src/shared/types/jwt.type";

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  signAccessToken(payload: AccessTokenPayloadCreate) {
    return this.jwtService.signAsync(payload, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
      expiresIn: ms(envConfig.ACCESS_TOKEN_EXPIRES_IN as StringValue) / 1000,
      algorithm: "HS256",
    });
  }

  signRefreshToken(payload: RefreshTokenPayloadCreate) {
    return this.jwtService.signAsync(payload, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
      expiresIn: ms(envConfig.REFRESH_TOKEN_EXPIRES_IN as StringValue) / 1000,
      algorithm: "HS256",
    });
  }

  verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
    });
  }

  verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
    });
  }
}
