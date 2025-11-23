import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { Request } from "express";
import { REQUEST_ROLE_PERMISSIONS, REQUEST_USER_KEY } from "src/shared/constants/auth.constant";
import { HTTPMethod } from "src/shared/constants/http.constant";
import { RolePermissionsType } from "src/shared/models/shared-role.model";
import { PrismaService } from "src/shared/services/prisma.service";
import { TokenService } from "src/shared/services/token.service";
import { AccessTokenPayload } from "src/shared/types/jwt.type";

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly prismaService: PrismaService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const decodedAccessToken = await this.extractAndValidateToken(request);

    await this.validateUserPermission(decodedAccessToken, request);
    return true;
  }

  private async extractAndValidateToken(request: Request): Promise<AccessTokenPayload> {
    const accessToken = this.extractAccessTokenFromHeader(request);
    try {
      const decodedAccessToken = await this.tokenService.verifyAccessToken(accessToken);

      request[REQUEST_USER_KEY] = decodedAccessToken;
      return decodedAccessToken;
    } catch {
      throw new UnauthorizedException("Error.InvalidAccessToken");
    }
  }

  private extractAccessTokenFromHeader(request: Request): string {
    const accessToken = request.headers.authorization?.split(" ")[1];
    if (!accessToken) {
      throw new UnauthorizedException("Error.MissingAccessToken");
    }
    return accessToken;
  }

  private async validateUserPermission(decodedAccessToken: AccessTokenPayload, request: Request): Promise<void> {
    const roleId: number = decodedAccessToken.roleId;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const path = request.route.path as string;
    const method = request.method as keyof typeof HTTPMethod;

    const role = (await this.prismaService.role
      .findUniqueOrThrow({
        where: {
          id: roleId,
          deletedAt: null,
          isActive: true,
        },
        include: {
          permissions: {
            where: {
              deletedAt: null,
              path,
              method,
            },
          },
        },
      })
      .catch(() => {
        throw new ForbiddenException();
      })) as unknown as RolePermissionsType;

    const canAccess = role.permissions.length > 0;

    if (!canAccess) {
      throw new ForbiddenException("Error.InsufficientPermissions");
    }

    request[REQUEST_ROLE_PERMISSIONS] = role;

    return;
  }
}
