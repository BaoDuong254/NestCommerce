import { HttpException, Injectable } from "@nestjs/common";
import { AuthRepository } from "src/routes/auth/auth.repo";
import {
  Disable2FABodyType,
  ForgotPasswordBodyType,
  LoginBodyType,
  RefreshTokenBodyType,
  RegisterBodyType,
  SendOTPBodyType,
} from "src/routes/auth/models/auth.model";
import { RolesService } from "src/routes/auth/roles.service";
import { generateOTP, isNotFoundPrismaError, isUniqueConstraintPrismaError } from "src/shared/helpers";
import { SharedUserRepository } from "src/shared/repositories/shared-user.repo";
import { HashingService } from "src/shared/services/hashing.service";
import { TokenService } from "src/shared/services/token.service";
import { EmailService } from "src/shared/services/email.service";
import { AccessTokenPayloadCreate } from "src/shared/types/jwt.type";
import { StringValue } from "ms";
import envConfig from "src/shared/config";
import { addMilliseconds } from "date-fns";
import ms from "ms";
import {
  EmailAlreadyExistsException,
  EmailNotFoundException,
  FailedToSendOTPException,
  InvalidOTPException,
  InvalidPasswordException,
  InvalidTOTPAndCodeException,
  InvalidTOTPException,
  OTPExpiredException,
  RefreshTokenAlreadyUsedException,
  TOTPAlreadyEnabledException,
  TOTPNotEnabledException,
  UnauthorizedAccessException,
} from "src/routes/auth/auth.error";
import { TypeOfVerificationCode, TypeOfVerificationCodeType } from "src/shared/constants/auth.constant";
import { TwoFactorService } from "src/shared/services/2fa.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly rolesService: RolesService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly emailService: EmailService,
    private readonly twoFactorService: TwoFactorService
  ) {}

  async validateVerificationCode({
    email,
    code,
    type,
  }: {
    email: string;
    code: string;
    type: TypeOfVerificationCodeType;
  }) {
    const verificationCode = await this.authRepository.findUniqueVerificationCode({
      email_code_type: {
        email,
        code,
        type,
      },
    });
    if (!verificationCode || verificationCode.code !== code) {
      throw InvalidOTPException;
    }
    if (verificationCode.expiresAt < new Date()) {
      throw OTPExpiredException;
    }
    return verificationCode;
  }

  async register(body: RegisterBodyType) {
    try {
      await this.validateVerificationCode({
        email: body.email,
        code: body.code,
        type: TypeOfVerificationCode.REGISTER,
      });
      const clientRoleID = await this.rolesService.getClientRoleID();
      const hashedPassword = await this.hashingService.hash(body.password);
      const [user] = await Promise.all([
        this.authRepository.createUser({
          email: body.email,
          name: body.name,
          phoneNumber: body.phoneNumber,
          password: hashedPassword,
          roleId: clientRoleID,
        }),
        this.authRepository.deleteVerificationCode({
          email_code_type: {
            email: body.email,
            code: body.code,
            type: TypeOfVerificationCode.REGISTER,
          },
        }),
      ]);
      return user;
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw EmailAlreadyExistsException;
      }
      throw error;
    }
  }

  async sendOTP(body: SendOTPBodyType) {
    const user = await this.sharedUserRepository.findUnique({ email: body.email });

    if (user && body.type === TypeOfVerificationCode.REGISTER) {
      throw EmailAlreadyExistsException;
    }

    if (!user && body.type === TypeOfVerificationCode.FORGOT_PASSWORD) {
      throw EmailNotFoundException;
    }

    const code = generateOTP();

    await this.authRepository.createVerificationCode({
      email: body.email,
      code,
      type: body.type,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN as StringValue)), // 5 minutes
    });

    const { error } = await this.emailService.sendOTP({ email: body.email, code });

    if (error) {
      throw FailedToSendOTPException;
    }

    return { message: "Verification code sent successfully" };
  }

  async login(body: LoginBodyType & { userAgent: string; ip: string }) {
    const user = await this.authRepository.findUniqueUserIncludeRole({ email: body.email });
    if (!user) {
      throw EmailNotFoundException;
    }

    const isPasswordValid = await this.hashingService.compare(body.password, user.password);
    if (!isPasswordValid) {
      throw InvalidPasswordException;
    }

    if (user.totpSecret) {
      if (!body.totpCode && !body.code) {
        throw InvalidTOTPAndCodeException;
      }
      if (body.totpCode) {
        const isTOTPValid = this.twoFactorService.verifyTOTP({
          email: user.email,
          secret: user.totpSecret,
          token: body.totpCode,
        });
        if (!isTOTPValid) {
          throw InvalidTOTPException;
        }
      } else if (body.code) {
        await this.validateVerificationCode({
          email: body.email,
          code: body.code,
          type: TypeOfVerificationCode.LOGIN,
        });
      }
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
      deviceId: payload.deviceId,
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
        throw RefreshTokenAlreadyUsedException;
      }

      const {
        deviceId,
        user: {
          roleId,
          role: { name: roleName },
        },
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
      throw UnauthorizedAccessException;
    }
  }

  async logout(refreshToken: string) {
    try {
      const deletedRefreshToken = await this.authRepository.deleteRefreshToken({ token: refreshToken });
      await this.authRepository.updateDevice(deletedRefreshToken.deviceId, {
        isActive: false,
      });
      return {
        message: "Logged out successfully",
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw RefreshTokenAlreadyUsedException;
      }
      throw UnauthorizedAccessException;
    }
  }

  async forgotPassword(body: ForgotPasswordBodyType) {
    const { email, code, newPassword } = body;

    const user = await this.sharedUserRepository.findUnique({ email });

    if (!user) {
      throw EmailNotFoundException;
    }

    await this.validateVerificationCode({
      email,
      code,
      type: TypeOfVerificationCode.FORGOT_PASSWORD,
    });

    const hashedPassword = await this.hashingService.hash(newPassword);

    await Promise.all([
      this.authRepository.updateUser({ id: user.id }, { password: hashedPassword }),

      this.authRepository.deleteVerificationCode({
        email_code_type: {
          email,
          code,
          type: TypeOfVerificationCode.FORGOT_PASSWORD,
        },
      }),
    ]);

    return {
      message: "Password reset successfully",
    };
  }

  async setupTwoFactorAuth(userId: number) {
    const user = await this.sharedUserRepository.findUnique({ id: userId });
    if (!user) {
      throw EmailNotFoundException;
    }

    if (user.totpSecret) {
      throw TOTPAlreadyEnabledException;
    }

    const { secret, uri } = this.twoFactorService.generateTOTPSecret(user.email);

    await this.authRepository.updateUser({ id: userId }, { totpSecret: secret });

    return {
      secret,
      uri,
    };
  }

  async disableTwoFactorAuth(data: Disable2FABodyType & { userId: number }) {
    const { userId, code, totpCode } = data;

    const user = await this.sharedUserRepository.findUnique({ id: userId });
    if (!user) {
      throw EmailNotFoundException;
    }

    if (!user.totpSecret) {
      throw TOTPNotEnabledException;
    }

    if (totpCode) {
      const isTOTPValid = this.twoFactorService.verifyTOTP({
        email: user.email,
        secret: user.totpSecret,
        token: totpCode,
      });
      if (!isTOTPValid) {
        throw InvalidTOTPException;
      }
    } else if (code) {
      await this.validateVerificationCode({
        email: user.email,
        code,
        type: TypeOfVerificationCode.DISABLE_2FA,
      });
    } else {
      throw InvalidTOTPAndCodeException;
    }

    await this.authRepository.updateUser({ id: userId }, { totpSecret: null });

    return {
      message: "Two-factor authentication disabled successfully",
    };
  }
}
