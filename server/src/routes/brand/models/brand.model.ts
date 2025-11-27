import { brandIncludeTranslationSchema, brandSchema } from "src/shared/models/shared-brand.model";
import { z } from "zod";

export const getBrandsResSchema = z.object({
  data: z.array(brandIncludeTranslationSchema),
  totalItems: z.number({ error: "Error.InvalidTotalItems" }),
  page: z.number({ error: "Error.InvalidPage" }),
  limit: z.number({ error: "Error.InvalidLimit" }),
  totalPages: z.number({ error: "Error.InvalidTotalPages" }),
});

export const getBrandParamsSchema = z
  .object({
    brandId: z.coerce
      .number({ error: "Error.InvalidBrandId" })
      .int({ error: "Error.BrandIdMustBeInteger" })
      .positive({ error: "Error.BrandIdMustBePositive" }),
  })
  .strict();

export const getBrandDetailResSchema = brandIncludeTranslationSchema;

export const createBrandBodySchema = brandSchema
  .pick({
    name: true,
    logo: true,
  })
  .strict();

export const updateBrandBodySchema = createBrandBodySchema;

export type BrandType = z.infer<typeof brandSchema>;
export type BrandIncludeTranslationType = z.infer<typeof brandIncludeTranslationSchema>;
export type GetBrandsResType = z.infer<typeof getBrandsResSchema>;
export type GetBrandDetailResType = z.infer<typeof getBrandDetailResSchema>;
export type CreateBrandBodyType = z.infer<typeof createBrandBodySchema>;
export type GetBrandParamsType = z.infer<typeof getBrandParamsSchema>;
export type UpdateBrandBodyType = z.infer<typeof updateBrandBodySchema>;
