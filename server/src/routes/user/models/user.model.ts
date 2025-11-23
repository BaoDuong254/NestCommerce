import { roleSchema } from "src/shared/models/shared-role.model";
import { userSchema } from "src/shared/models/shared-user.model";
import { z } from "zod";

export const getUsersResSchema = z.object({
  data: z.array(
    userSchema.omit({ password: true, totpSecret: true }).extend({
      role: roleSchema.pick({
        id: true,
        name: true,
      }),
    })
  ),
  totalItems: z.number({ error: "Error.InvalidTotalItems" }),
  page: z.number({ error: "Error.InvalidPage" }),
  limit: z.number({ error: "Error.InvalidLimit" }),
  totalPages: z.number({ error: "Error.InvalidTotalPages" }),
});

export const getUsersQuerySchema = z
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

export const getUserParamsSchema = z
  .object({
    userId: z.coerce
      .number({ error: "Error.InvalidUserId" })
      .int({ error: "Error.UserIdMustBeInteger" })
      .positive({ error: "Error.UserIdMustBePositive" }),
  })
  .strict();

export const createUserBodySchema = userSchema
  .pick({
    email: true,
    name: true,
    phoneNumber: true,
    avatar: true,
    status: true,
    password: true,
    roleId: true,
  })
  .strict();

export const updateUserBodySchema = createUserBodySchema;

export type GetUsersResType = z.infer<typeof getUsersResSchema>;
export type GetUsersQueryType = z.infer<typeof getUsersQuerySchema>;
export type GetUserParamsType = z.infer<typeof getUserParamsSchema>;
export type CreateUserBodyType = z.infer<typeof createUserBodySchema>;
export type UpdateUserBodyType = z.infer<typeof updateUserBodySchema>;
