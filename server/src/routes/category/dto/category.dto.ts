import { createZodDto } from "nestjs-zod";
import {
  createCategoryBodySchema,
  getAllCategoriesQuerySchema,
  getAllCategoriesResSchema,
  getCategoryDetailResSchema,
  getCategoryParamsSchema,
  updateCategoryBodySchema,
} from "src/routes/category/models/category.model";

export class GetAllCategoriesResDto extends createZodDto(getAllCategoriesResSchema) {}
export class GetAllCategoriesQueryDto extends createZodDto(getAllCategoriesQuerySchema) {}
export class GetCategoryParamsDto extends createZodDto(getCategoryParamsSchema) {}
export class GetCategoryDetailResDto extends createZodDto(getCategoryDetailResSchema) {}
export class CreateCategoryBodyDto extends createZodDto(createCategoryBodySchema) {}
export class UpdateCategoryBodyDto extends createZodDto(updateCategoryBodySchema) {}
