import { createZodDto } from "nestjs-zod";
import {
  createUserBodySchema,
  getUserParamsSchema,
  getUsersQuerySchema,
  getUsersResSchema,
  updateUserBodySchema,
} from "src/routes/user/models/user.model";
import { UpdateProfileResDto } from "src/shared/dtos/shared-user.dto";

export class GetUsersResDto extends createZodDto(getUsersResSchema) {}
export class GetUsersQueryDto extends createZodDto(getUsersQuerySchema) {}
export class GetUserParamsDto extends createZodDto(getUserParamsSchema) {}
export class CreateUserBodyDto extends createZodDto(createUserBodySchema) {}
export class UpdateUserBodyDto extends createZodDto(updateUserBodySchema) {}
export class CreateUserResDto extends UpdateProfileResDto {}
