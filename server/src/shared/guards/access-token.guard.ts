import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  Inject,
} from "@nestjs/common";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";
import { keyBy } from "lodash";
import { REQUEST_ROLE_PERMISSIONS, REQUEST_USER_KEY } from "src/shared/constants/auth.constant";
import { HTTPMethod } from "src/shared/constants/http.constant";
import { RolePermissionsType } from "src/shared/models/shared-role.model";
import { PrismaService } from "src/shared/services/prisma.service";
import { TokenService } from "src/shared/services/token.service";
import { AccessTokenPayload } from "src/shared/types/jwt.type";

type Permission = RolePermissionsType["permissions"][number];
type CachedRole = RolePermissionsType & {
  permissions: {
    [key: string]: Permission;
  };
};

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let request: Request;
    let isGraphql: boolean = false;
    if (context.getType<GqlContextType>() === "graphql") {
      const gqlContext = GqlExecutionContext.create(context);
      request = gqlContext.getContext<{ req: Request; res: Response }>().req;
      isGraphql = true;
    } else {
      request = context.switchToHttp().getRequest<Request>();
    }

    const decodedAccessToken = await this.extractAndValidateToken(request);

    await this.validateUserPermission(decodedAccessToken, request, isGraphql);
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

  private async validateUserPermission(
    decodedAccessToken: AccessTokenPayload,
    request: Request,
    isGraphql: boolean
  ): Promise<void> {
    const roleId: number = decodedAccessToken.roleId;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    let path = isGraphql ? request.baseUrl : (request.route.path as string);
    const method = request.method as keyof typeof HTTPMethod;

    // Strip global prefix and version from path to match seeded permissions
    // Example: /api/v1/cart -> /cart
    path = path.replace(/^\/api\/v\d+/, "");

    const cacheKey = `role:${roleId}`;
    let cacheRole = await this.cacheManager.get<CachedRole>(cacheKey);
    if (!cacheRole) {
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
              },
            },
          },
        })
        .catch(() => {
          throw new ForbiddenException();
        })) as unknown as RolePermissionsType;

      const permissionObject = keyBy(
        role.permissions,
        (permission) => `${permission.path}:${permission.method}`
      ) as CachedRole["permissions"];

      cacheRole = { ...role, permissions: permissionObject };
      await this.cacheManager.set(cacheKey, cacheRole, 1000 * 60 * 60); // Cache for 1 hour

      request[REQUEST_ROLE_PERMISSIONS] = role;
    }

    const canAccess: Permission | undefined = cacheRole.permissions[`${path}:${method}`];
    if (!canAccess) {
      throw new ForbiddenException();
    }

    return;
  }
}
