import { categoryTranslationSchema } from "src/shared/models/shared-category-translation.model";
import { z } from "zod";

export const getCategoryTranslationParamsSchema = z
  .object({
    categoryTranslationId: z.coerce
      .number({ error: "Error.InvalidCategoryTranslationId" })
      .int({ error: "Error.CategoryTranslationIdMustBeInteger" })
      .positive({ error: "Error.CategoryTranslationIdMustBePositive" }),
  })
  .strict();
export const getCategoryTranslationDetailResSchema = categoryTranslationSchema;
export const createCategoryTranslationBodySchema = categoryTranslationSchema
  .pick({
    categoryId: true,
    languageId: true,
    name: true,
    description: true,
  })
  .strict();
export const updateCategoryTranslationBodySchema = createCategoryTranslationBodySchema;

export type CategoryTranslationType = z.infer<typeof categoryTranslationSchema>;
export type GetCategoryTranslationDetailResType = z.infer<typeof getCategoryTranslationDetailResSchema>;
export type CreateCategoryTranslationBodyType = z.infer<typeof createCategoryTranslationBodySchema>;
export type UpdateCategoryTranslationBodyType = z.infer<typeof updateCategoryTranslationBodySchema>;
