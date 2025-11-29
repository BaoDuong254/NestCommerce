import { createZodDto } from "nestjs-zod";
import {
  createCategoryTranslationBodySchema,
  getCategoryTranslationDetailResSchema,
  getCategoryTranslationParamsSchema,
  updateCategoryTranslationBodySchema,
} from "src/routes/category/category-translation/models/category-translation.model";

export class GetCategoryTranslationDetailResDto extends createZodDto(getCategoryTranslationDetailResSchema) {}
export class GetCategoryTranslationParamsDto extends createZodDto(getCategoryTranslationParamsSchema) {}
export class CreateCategoryTranslationBodyDto extends createZodDto(createCategoryTranslationBodySchema) {}
export class UpdateCategoryTranslationBodyDto extends createZodDto(updateCategoryTranslationBodySchema) {}
