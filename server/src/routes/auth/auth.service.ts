/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { HashingService } from "src/shared/services/hashing.service";
import { PrismaService } from "src/shared/services/prisma.service";
import { Prisma } from "generated/prisma";
import { LoginBody, RegisterBody } from "src/routes/auth/dto/create-auth.dto";
import { TokenService } from "src/shared/services/token.service";
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from "src/shared/helpers";

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService
  ) {}

  async register(body: RegisterBody) {
    try {
      const hashedPassword = await this.hashingService.hash(body.password);
      const user = await this.prismaService.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          name: body.name,
        },
      });
      return user;
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw new ConflictException("Email already exists");
      }
      throw error;
    }
  }

  async login(body: LoginBody) {
    const user = await this.prismaService.user.findUnique({
      where: { email: body.email },
    });
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const isPasswordValid = await this.hashingService.compare(body.password, user.password);
    if (!isPasswordValid) {
      throw new UnprocessableEntityException([
        {
          field: "password",
          message: "Invalid password",
        },
      ]);
    }
    const tokens = await this.generateTokens({ userId: user.id });
    return tokens;
  }

  async generateTokens(payload: { userId: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload),
    ]);
    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken);
    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt: new Date(decodedRefreshToken.exp * 1000),
      },
    });
    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken);

      await this.prismaService.refreshToken.findUniqueOrThrow({
        where: {
          token: refreshToken,
        },
      });

      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      });

      return await this.generateTokens({ userId });
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new UnauthorizedException("Refresh token has been revoked");
      }
      throw new UnauthorizedException();
    }
  }

  async logout(refreshToken: string) {
    try {
      await this.tokenService.verifyRefreshToken(refreshToken);

      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      });
      return { message: "Logout successfully" };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new UnauthorizedException("Refresh token has been revoked");
      }
      throw new UnauthorizedException();
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
