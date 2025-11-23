import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { REQUEST_ROLE_PERMISSIONS } from "src/shared/constants/auth.constant";
import { RolePermissionsType } from "src/shared/models/shared-role.model";

export const ActiveRolePermissions = createParamDecorator(
  (field: keyof RolePermissionsType | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const rolePermissions = request[REQUEST_ROLE_PERMISSIONS] as RolePermissionsType | undefined;
    return field ? rolePermissions?.[field] : rolePermissions;
  }
);
