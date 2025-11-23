import { z } from "zod";
import { permissionSchema } from "src/shared/models/shared-permission.model";
import { roleSchema } from "src/shared/models/shared-role.model";

export const roleWithPermissionsSchema = roleSchema.extend({
  permissions: z.array(permissionSchema, { error: "Error.InvalidPermissions" }),
});

export const getRolesResSchema = z.object({
  data: z.array(roleSchema, { error: "Error.InvalidRolesData" }),
  totalItems: z.number({ error: "Error.InvalidTotalItems" }),
  page: z.number({ error: "Error.InvalidPage" }),
  limit: z.number({ error: "Error.InvalidLimit" }),
  totalPages: z.number({ error: "Error.InvalidTotalPages" }),
});

export const getRolesQuerySchema = z
  .object({
    page: z.coerce
      .number({ error: "Error.InvalidPage" })
      .int({ error: "Error.PageMustBeInteger" })
      .positive({ error: "Error.PageMustBePositive" })
      .default(1),
    limit: z.coerce
      .number({ error: "Error.InvalidLimit" })
      .int({ error: "Error.LimitMustBeInteger" })
      .positive({ error: "Error.LimitMustBePositive" })
      .default(10),
  })
  .strict();

export const getRoleParamsSchema = z
  .object({
    roleId: z.coerce.number({ error: "Error.InvalidRoleId" }),
  })
  .strict();

export const getRoleDetailResSchema = roleWithPermissionsSchema;

export const createRoleBodySchema = roleSchema
  .pick({
    name: true,
    description: true,
    isActive: true,
  })
  .strict();

export const updateRoleBodySchema = roleSchema
  .pick({
    name: true,
    description: true,
    isActive: true,
  })
  .extend({
    permissionIds: z.array(z.number({ error: "Error.InvalidPermissionId" }), {
      error: "Error.InvalidPermissionIds",
    }),
  })
  .strict();

export type RoleWithPermissionsType = z.infer<typeof roleWithPermissionsSchema>;
export type GetRolesResType = z.infer<typeof getRolesResSchema>;
export type GetRolesQueryType = z.infer<typeof getRolesQuerySchema>;
export type GetRoleDetailResType = z.infer<typeof getRoleDetailResSchema>;
export type CreateRoleBodyType = z.infer<typeof createRoleBodySchema>;
export type GetRoleParamsType = z.infer<typeof getRoleParamsSchema>;
export type UpdateRoleBodyType = z.infer<typeof updateRoleBodySchema>;
