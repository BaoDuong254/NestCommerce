import { permissionSchema } from "src/shared/models/shared-permission.model";
import { z } from "zod";

export const roleSchema = z.object({
  id: z.number({ error: "Error.InvalidRoleId" }).positive({ error: "Error.InvalidRoleId" }),
  name: z.string({ error: "Error.InvalidRoleName" }).max(500, { error: "Error.RoleNameTooLong" }),
  description: z.string({ error: "Error.InvalidRoleDescription" }),
  isActive: z.boolean({ error: "Error.InvalidIsActive" }).default(true),
  createdById: z.number({ error: "Error.InvalidCreatedById" }).nullable(),
  updatedById: z.number({ error: "Error.InvalidUpdatedById" }).nullable(),
  deletedById: z.number({ error: "Error.InvalidDeletedById" }).nullable(),
  deletedAt: z.date({ error: "Error.InvalidDeletedAt" }).nullable(),
  createdAt: z.date({ error: "Error.InvalidCreatedAt" }),
  updatedAt: z.date({ error: "Error.InvalidUpdatedAt" }),
});

export const rolePermissionsSchema = roleSchema.extend({
  permissions: z.array(permissionSchema),
});

export type RoleType = z.infer<typeof roleSchema>;
export type RolePermissionsType = z.infer<typeof rolePermissionsSchema>;
