import { HttpException, Injectable, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common";
import ms, { StringValue } from "ms";
import { AuthRepository } from "src/routes/auth/auth.repo";
import {
  LoginBodyType,
  RefreshTokenBodyType,
  RegisterBodyType,
  SendOTPBodyType,
} from "src/routes/auth/models/auth.model";
import { RolesService } from "src/routes/auth/roles.service";
import envConfig from "src/shared/config";
import { generateOTP, isUniqueConstraintPrismaError } from "src/shared/helpers";
import { SharedUserRepository } from "src/shared/repositories/shared-user.repo";
import { HashingService } from "src/shared/services/hashing.service";
import { TokenService } from "src/shared/services/token.service";
import { addMilliseconds } from "date-fns";
import { EmailService } from "src/shared/services/email.service";
import { AccessTokenPayloadCreate } from "src/shared/types/jwt.type";

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly rolesService: RolesService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly emailService: EmailService
  ) {}

  async register(body: RegisterBodyType) {
    try {
      const verificationCode = await this.authRepository.findUniqueVerificationCode({
        email_type: {
          email: body.email,
          type: "REGISTER",
        },
      });
      if (!verificationCode || verificationCode.code !== body.code) {
        throw new UnprocessableEntityException([
          {
            path: "code",
            message: "Invalid verification code",
          },
        ]);
      }
      if (verificationCode.expiresAt < new Date()) {
        throw new UnprocessableEntityException([
          {
            path: "code",
            message: "Verification code has expired",
          },
        ]);
      }
      const clientRoleID = await this.rolesService.getClientRoleID();
      const hashedPassword = await this.hashingService.hash(body.password);
      return await this.authRepository.createUser({
        email: body.email,
        name: body.name,
        phoneNumber: body.phoneNumber,
        password: hashedPassword,
        roleId: clientRoleID,
      });
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw new UnprocessableEntityException([
          {
            path: "email",
            message: "Email is already in use",
          },
        ]);
      }
      throw error;
    }
  }

  async sendOTP(body: SendOTPBodyType) {
    const user = await this.sharedUserRepository.findUnique({ email: body.email });

    if (user) {
      throw new UnprocessableEntityException([
        {
          path: "email",
          message: "Email is already in use",
        },
      ]);
    }

    const code = generateOTP();
    const verificationCode = this.authRepository.createVerificationCode({
      email: body.email,
      code,
      type: body.type,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN as StringValue)), // 5 minutes
    });

    const { error } = await this.emailService.sendOTP({ email: body.email, code });

    if (error) {
      throw new UnprocessableEntityException([
        {
          path: "code",
          message: "Failed to send verification code",
        },
      ]);
    }

    return verificationCode;
  }

  async login(body: LoginBodyType & { userAgent: string; ip: string }) {
    const user = await this.authRepository.findUniqueUserIncludeRole({ email: body.email });
    if (!user) {
      throw new UnprocessableEntityException([
        {
          message: "Invalid email or password",
          path: "email",
        },
      ]);
    }
    const isPasswordValid = await this.hashingService.compare(body.password, user.password);
    if (!isPasswordValid) {
      throw new UnprocessableEntityException([
        {
          message: "Invalid email or password",
          path: "password",
        },
      ]);
    }
    const device = await this.authRepository.createDevice({
      userId: user.id,
      userAgent: body.userAgent,
      ip: body.ip,
    });
    return this.generateTokens({
      userId: user.id,
      deviceId: device.id,
      roleId: user.roleId,
      roleName: user.role.name,
    });
  }

  async generateTokens(payload: AccessTokenPayloadCreate) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({
        ...payload,
      }),
      this.tokenService.signRefreshToken(payload),
    ]);
    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken);
    await this.authRepository.createRefreshToken({
      token: refreshToken,
      userId: payload.userId,
      expiresAt: new Date(decodedRefreshToken.exp * 1000),
      deviceId: 1,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken({ refreshToken, userAgent, ip }: RefreshTokenBodyType & { userAgent: string; ip: string }) {
    try {
      // Verify refresh token validity
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken);
      const refreshTokenInDB = await this.authRepository.findUniqueRefreshTokenIncludeUserRole({
        token: refreshToken,
      });
      if (!refreshTokenInDB) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const {
        deviceId,
        user: { roleId, name: roleName },
      } = refreshTokenInDB;

      // Update device info
      const $updateDevice = this.authRepository.updateDevice(deviceId, {
        ip,
        userAgent,
      });
      // Delete old refresh token
      const $deleteRefreshToken = this.authRepository.deleteRefreshToken({
        token: refreshToken,
      });
      // Generate new tokens
      const $tokens = this.generateTokens({
        userId,
        deviceId,
        roleId,
        roleName,
      });
      // Await all promises
      const [, , tokens] = await Promise.all([$updateDevice, $deleteRefreshToken, $tokens]);
      return tokens;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnauthorizedException("Invalid refresh token");
    }
  }
}
