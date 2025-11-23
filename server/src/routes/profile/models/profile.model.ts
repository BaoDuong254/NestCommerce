import { userSchema } from "src/shared/models/shared-user.model";
import { z } from "zod";

export const updateMeBodySchema = userSchema
  .pick({
    name: true,
    phoneNumber: true,
    avatar: true,
  })
  .strict();

export const changePasswordBodySchema = userSchema
  .pick({
    password: true,
  })
  .extend({
    newPassword: z
      .string({ error: "Error.InvalidNewPassword" })
      .min(8, { error: "Error.NewPasswordTooShort" })
      .max(128, { error: "Error.NewPasswordTooLong" }),
    confirmNewPassword: z
      .string({ error: "Error.InvalidConfirmPassword" })
      .min(8, { error: "Error.ConfirmPasswordTooShort" })
      .max(128, { error: "Error.ConfirmPasswordTooLong" }),
  })
  .strict()
  .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
    if (newPassword !== confirmNewPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Error.ConfirmPasswordNotMatch",
        path: ["confirmNewPassword"],
      });
    }
  });

export type UpdateMeBodyType = z.infer<typeof updateMeBodySchema>;
export type ChangePasswordBodyType = z.infer<typeof changePasswordBodySchema>;
