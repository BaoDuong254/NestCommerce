import { HTTPMethod } from "src/shared/constants/http.constant";
import { z } from "zod";

export const permissionSchema = z.object({
  id: z.number({ error: "Error.InvalidID" }).positive({ error: "Error.InvalidID" }),
  name: z.string({ error: "Error.InvalidName" }).max(500, { error: "Error.NameTooLong" }),
  description: z.string({ error: "Error.InvalidDescription" }),
  module: z.string({ error: "Error.InvalidModule" }).max(500, { error: "Error.ModuleTooLong" }),
  path: z.string({ error: "Error.InvalidPath" }).max(1000, { error: "Error.PathTooLong" }),
  method: z.enum(
    [
      HTTPMethod.GET,
      HTTPMethod.POST,
      HTTPMethod.PUT,
      HTTPMethod.DELETE,
      HTTPMethod.PATCH,
      HTTPMethod.OPTIONS,
      HTTPMethod.HEAD,
    ],
    { error: "Error.InvalidMethod" }
  ),
  createdById: z.number({ error: "Error.InvalidCreatedByID" }).nullable(),
  updatedById: z.number({ error: "Error.InvalidUpdatedByID" }).nullable(),
  deletedById: z.number({ error: "Error.InvalidDeletedByID" }).nullable(),
  deletedAt: z.date({ error: "Error.InvalidDeletedAt" }).nullable(),
  createdAt: z.date({ error: "Error.InvalidCreatedAt" }),
  updatedAt: z.date({ error: "Error.InvalidUpdatedAt" }),
});

export type PermissionType = z.infer<typeof permissionSchema>;
