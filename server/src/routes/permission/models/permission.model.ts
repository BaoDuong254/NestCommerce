import { permissionSchema } from "src/shared/models/shared-permission.model";
import { z } from "zod";

export const getPermissionsResSchema = z.object({
  data: z.array(permissionSchema, { error: "Error.InvalidData" }),
  totalItems: z.number({ error: "Error.InvalidTotalItems" }),
  page: z.number({ error: "Error.InvalidPage" }),
  limit: z.number({ error: "Error.InvalidLimit" }),
  totalPages: z.number({ error: "Error.InvalidTotalPages" }),
});

export const getPermissionsQuerySchema = z
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

export const getPermissionParamsSchema = z
  .object({
    permissionId: z.coerce.number({ error: "Error.InvalidPermissionID" }),
  })
  .strict();

export const getPermissionDetailResSchema = permissionSchema;

export const createPermissionBodySchema = permissionSchema
  .pick({
    name: true,
    path: true,
    method: true,
    module: true,
  })
  .strict();

export const updatePermissionBodySchema = createPermissionBodySchema;

export type GetPermissionsResType = z.infer<typeof getPermissionsResSchema>;
export type GetPermissionsQueryType = z.infer<typeof getPermissionsQuerySchema>;
export type GetPermissionDetailResType = z.infer<typeof getPermissionDetailResSchema>;
export type CreatePermissionBodyType = z.infer<typeof createPermissionBodySchema>;
export type GetPermissionParamsType = z.infer<typeof getPermissionParamsSchema>;
export type UpdatePermissionBodyType = z.infer<typeof updatePermissionBodySchema>;
