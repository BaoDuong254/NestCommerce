import { createZodDto } from "nestjs-zod";
import { emptyBodySchema, paginationQuerySchema } from "src/shared/models/request.model";

export class EmptyBodyDto extends createZodDto(emptyBodySchema) {}
export class PaginationQueryDto extends createZodDto(paginationQuerySchema) {}
