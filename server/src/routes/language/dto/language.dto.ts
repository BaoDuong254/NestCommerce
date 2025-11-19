import { createZodDto } from "nestjs-zod";
import {
  createLanguageBodySchema,
  getLanguageDetailResSchema,
  getLanguageParamsSchema,
  getLanguagesResSchema,
  updateLanguageBodySchema,
} from "src/routes/language/models/language.model";

export class GetLanguagesResDto extends createZodDto(getLanguagesResSchema) {}
export class GetLanguageParamsDto extends createZodDto(getLanguageParamsSchema) {}
export class GetLanguageDetailResDto extends createZodDto(getLanguageDetailResSchema) {}
export class CreateLanguageBodyDto extends createZodDto(createLanguageBodySchema) {}
export class UpdateLanguageBodyDto extends createZodDto(updateLanguageBodySchema) {}
