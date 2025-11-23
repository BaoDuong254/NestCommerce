import { createZodDto } from "nestjs-zod";
import { getUserProfileResSchema, updateProfileResSchema } from "src/shared/models/shared-user.model";

export class GetUserProfileResDto extends createZodDto(getUserProfileResSchema) {}
export class UpdateProfileResDto extends createZodDto(updateProfileResSchema) {}
