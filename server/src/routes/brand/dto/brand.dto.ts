import { createZodDto } from "nestjs-zod";
import {
  createBrandBodySchema,
  getBrandDetailResSchema,
  getBrandParamsSchema,
  getBrandsResSchema,
  updateBrandBodySchema,
} from "src/routes/brand/models/brand.model";

export class GetBrandsResDto extends createZodDto(getBrandsResSchema) {}
export class GetBrandParamsDto extends createZodDto(getBrandParamsSchema) {}
export class GetBrandDetailResDto extends createZodDto(getBrandDetailResSchema) {}
export class CreateBrandBodyDto extends createZodDto(createBrandBodySchema) {}
export class UpdateBrandBodyDto extends createZodDto(updateBrandBodySchema) {}
