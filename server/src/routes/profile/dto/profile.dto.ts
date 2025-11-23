import { createZodDto } from "nestjs-zod";
import { changePasswordBodySchema, updateMeBodySchema } from "src/routes/profile/models/profile.model";

export class UpdateMeBodyDto extends createZodDto(updateMeBodySchema) {}
export class ChangePasswordBodyDto extends createZodDto(changePasswordBodySchema) {}
