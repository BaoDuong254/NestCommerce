import { createZodDto } from "nestjs-zod";
import {
  createRoleBodySchema,
  createRoleResSchema,
  getRoleDetailResSchema,
  getRoleParamsSchema,
  getRolesQuerySchema,
  getRolesResSchema,
  updateRoleBodySchema,
} from "src/routes/role/models/role.model";

export class GetRolesResDto extends createZodDto(getRolesResSchema) {}
export class GetRoleParamsDto extends createZodDto(getRoleParamsSchema) {}
export class GetRoleDetailResDto extends createZodDto(getRoleDetailResSchema) {}
export class CreateRoleBodyDto extends createZodDto(createRoleBodySchema) {}
export class CreateRoleResDto extends createZodDto(createRoleResSchema) {}
export class UpdateRoleBodyDto extends createZodDto(updateRoleBodySchema) {}
export class GetRolesQueryDto extends createZodDto(getRolesQuerySchema) {}
