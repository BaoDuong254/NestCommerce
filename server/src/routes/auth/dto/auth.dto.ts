import { createZodDto } from "nestjs-zod";
import { registerBodySchema, registerResSchema, sendOTPBodySchema } from "src/routes/auth/models/auth.model";

export class RegisterBodyDto extends createZodDto(registerBodySchema) {}
export class RegisterResDto extends createZodDto(registerResSchema) {}
export class SendOTPBodyDto extends createZodDto(sendOTPBodySchema) {}
