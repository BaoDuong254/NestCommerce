import { UserStatus } from "src/shared/constants/auth.constant";
import { permissionSchema } from "src/shared/models/shared-permission.model";
import { roleSchema } from "src/shared/models/shared-role.model";
import { z } from "zod";

export const userSchema = z.object({
  id: z.number({ error: "Error.InvalidID" }).positive({ error: "Error.InvalidID" }),
  email: z.email({ error: "Error.InvalidEmail" }),
  name: z
    .string({ error: "Error.InvalidName" })
    .min(1, { error: "Error.NameTooShort" })
    .max(100, { error: "Error.NameTooLong" }),
  password: z
    .string({ error: "Error.InvalidPassword" })
    .min(8, { error: "Error.PasswordTooShort" })
    .max(128, { error: "Error.PasswordTooLong" }),
  phoneNumber: z
    .string({ error: "Error.InvalidPhoneNumber" })
    .min(10, { error: "Error.PhoneNumberTooShort" })
    .max(15, { error: "Error.PhoneNumberTooLong" }),
  avatar: z.string({ error: "Error.InvalidAvatar" }).nullable(),
  totpSecret: z.string({ error: "Error.InvalidTotpSecret" }).nullable(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BLOCKED], { error: "Error.InvalidStatus" }),
  roleId: z.number({ error: "Error.InvalidRoleID" }).positive({ error: "Error.InvalidRoleID" }),
  createdById: z.number({ error: "Error.InvalidCreatedByID" }).nullable(),
  updatedById: z.number({ error: "Error.InvalidUpdatedByID" }).nullable(),
  deletedById: z.number({ error: "Error.InvalidDeletedByID" }).nullable(),
  deletedAt: z.iso.datetime({ error: "Error.InvalidDeletedAt" }).nullable(),
  createdAt: z.iso.datetime({ error: "Error.InvalidCreatedAt" }),
  updatedAt: z.iso.datetime({ error: "Error.InvalidUpdatedAt" }),
});

export const getUserProfileResSchema = userSchema
  .omit({
    password: true,
    totpSecret: true,
  })
  .extend({
    role: roleSchema
      .pick({
        id: true,
        name: true,
      })
      .extend({
        permissions: z.array(
          permissionSchema.pick({
            id: true,
            name: true,
            module: true,
            path: true,
            method: true,
          })
        ),
      }),
  });

export const updateProfileResSchema = userSchema.omit({
  password: true,
  totpSecret: true,
});

export type UserType = z.infer<typeof userSchema>;
export type GetUserProfileResType = z.infer<typeof getUserProfileResSchema>;
export type UpdateProfileResType = z.infer<typeof updateProfileResSchema>;
