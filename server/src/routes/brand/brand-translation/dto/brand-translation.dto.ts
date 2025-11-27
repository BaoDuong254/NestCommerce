import { createZodDto } from "nestjs-zod";
import {
  createBrandTranslationBodySchema,
  getBrandTranslationDetailResSchema,
  getBrandTranslationParamsSchema,
  updateBrandTranslationBodySchema,
} from "src/routes/brand/brand-translation/models/brand-translation.model";

export class GetBrandTranslationDetailResDto extends createZodDto(getBrandTranslationDetailResSchema) {}
export class GetBrandTranslationParamsDto extends createZodDto(getBrandTranslationParamsSchema) {}
export class CreateBrandTranslationBodyDto extends createZodDto(createBrandTranslationBodySchema) {}
export class UpdateBrandTranslationBodyDto extends createZodDto(updateBrandTranslationBodySchema) {}
