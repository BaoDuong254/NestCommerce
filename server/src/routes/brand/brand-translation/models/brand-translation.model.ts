import { brandTranslationSchema } from "src/shared/models/shared-brand-translation.model";
import { z } from "zod";

export const getBrandTranslationParamsSchema = z
  .object({
    brandTranslationId: z.coerce
      .number({ error: "Error.InvalidBrandTranslationId" })
      .int({ error: "Error.BrandTranslationIdMustBeInteger" })
      .positive({ error: "Error.BrandTranslationIdMustBePositive" }),
  })
  .strict();

export const getBrandTranslationDetailResSchema = brandTranslationSchema;

export const createBrandTranslationBodySchema = brandTranslationSchema
  .pick({
    brandId: true,
    languageId: true,
    name: true,
    description: true,
  })
  .strict();

export const updateBrandTranslationBodySchema = createBrandTranslationBodySchema;

export type BrandTranslationType = z.infer<typeof brandTranslationSchema>;
export type GetBrandTranslationDetailResType = z.infer<typeof getBrandTranslationDetailResSchema>;
export type CreateBrandTranslationBodyType = z.infer<typeof createBrandTranslationBodySchema>;
export type UpdateBrandTranslationBodyType = z.infer<typeof updateBrandTranslationBodySchema>;
