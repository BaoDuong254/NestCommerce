import { createZodDto } from "nestjs-zod";
import {
  createPermissionBodySchema,
  getPermissionDetailResSchema,
  getPermissionParamsSchema,
  getPermissionsQuerySchema,
  getPermissionsResSchema,
  updatePermissionBodySchema,
} from "src/routes/permission/models/permission.model";

export class GetPermissionsResDto extends createZodDto(getPermissionsResSchema) {}
export class GetPermissionParamsDto extends createZodDto(getPermissionParamsSchema) {}
export class GetPermissionDetailResDto extends createZodDto(getPermissionDetailResSchema) {}
export class CreatePermissionBodyDto extends createZodDto(createPermissionBodySchema) {}
export class UpdatePermissionBodyDto extends createZodDto(updatePermissionBodySchema) {}
export class GetPermissionsQueryDto extends createZodDto(getPermissionsQuerySchema) {}
