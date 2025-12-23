import { Injectable } from "@nestjs/common";
import {
  CreatePermissionBodyType,
  GetPermissionsQueryType,
  GetPermissionsResType,
  UpdatePermissionBodyType,
} from "src/routes/permission/models/permission.model";
import { SerializeAll } from "src/shared/decorators/serialize.decorator";
import { PermissionType } from "src/shared/models/shared-permission.model";
import { PrismaService } from "src/shared/services/prisma.service";

@Injectable()
@SerializeAll()
export class PermissionRepo {
  constructor(private prismaService: PrismaService) {}

  async list(pagination: GetPermissionsQueryType): Promise<GetPermissionsResType> {
    const skip = (pagination.page - 1) * pagination.limit;
    const take = pagination.limit;
    const [totalItems, data] = await Promise.all([
      this.prismaService.permission.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.permission.findMany({
        where: {
          deletedAt: null,
        },
        skip,
        take,
      }),
    ]);
    return {
      data,
      totalItems,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(totalItems / pagination.limit),
    } as unknown as Promise<GetPermissionsResType>;
  }

  findById(id: number): Promise<PermissionType | null> {
    return this.prismaService.permission.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    }) as unknown as Promise<PermissionType | null>;
  }

  create({
    createdById,
    data,
  }: {
    createdById: number | null;
    data: CreatePermissionBodyType;
  }): Promise<PermissionType> {
    return this.prismaService.permission.create({
      data: {
        ...data,
        createdById,
      },
    }) as unknown as Promise<PermissionType>;
  }

  update({
    id,
    updatedById,
    data,
  }: {
    id: number;
    updatedById: number;
    data: UpdatePermissionBodyType;
  }): Promise<PermissionType> {
    return this.prismaService.permission.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        ...data,
        updatedById,
      },
    }) as unknown as Promise<PermissionType>;
  }

  delete(
    {
      id,
      deletedById,
    }: {
      id: number;
      deletedById: number;
    },
    isHard?: boolean
  ): Promise<PermissionType> {
    return isHard
      ? (this.prismaService.permission.delete({
          where: {
            id,
          },
        }) as unknown as Promise<PermissionType>)
      : (this.prismaService.permission.update({
          where: {
            id,
            deletedAt: null,
          },
          data: {
            deletedAt: new Date(),
            deletedById,
          },
        }) as unknown as Promise<PermissionType>);
  }
}
