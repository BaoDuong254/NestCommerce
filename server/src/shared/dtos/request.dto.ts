import { createZodDto } from "nestjs-zod";
import { emptyBodySchema } from "src/shared/models/request.model";

export class EmptyBodyDto extends createZodDto(emptyBodySchema) {}
