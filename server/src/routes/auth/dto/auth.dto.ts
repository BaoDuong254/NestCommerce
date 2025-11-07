import { createZodDto } from "nestjs-zod";
import { registerBodySchema, registerResSchema } from "src/routes/auth/models/auth.model";

export class RegisterBodyDto extends createZodDto(registerBodySchema) {}
export class RegisterResDto extends createZodDto(registerResSchema) {}
