import { categoryIncludeTranslationSchema, categorySchema } from "src/shared/models/shared-category.model";
import { z } from "zod";

export const getAllCategoriesResSchema = z.object({
  data: z.array(categorySchema),
  totalItems: z.number({ error: "Error.InvalidTotalItems" }),
});

export const getAllCategoriesQuerySchema = z.object({
  parentCategoryId: z.coerce
    .number({ error: "Error.InvalidParentCategoryId" })
    .int({ error: "Error.ParentCategoryIdMustBeInteger" })
    .positive({ error: "Error.ParentCategoryIdMustBePositive" })
    .optional(),
});

export const getCategoryParamsSchema = z
  .object({
    categoryId: z.coerce
      .number({ error: "Error.InvalidCategoryId" })
      .int({ error: "Error.CategoryIdMustBeInteger" })
      .positive({ error: "Error.CategoryIdMustBePositive" }),
  })
  .strict();

export const getCategoryDetailResSchema = categoryIncludeTranslationSchema;

export const createCategoryBodySchema = categorySchema
  .pick({
    name: true,
    logo: true,
    parentCategoryId: true,
  })
  .strict();

export const updateCategoryBodySchema = createCategoryBodySchema;

export type CategoryType = z.infer<typeof categorySchema>;
export type CategoryIncludeTranslationType = z.infer<typeof categoryIncludeTranslationSchema>;
export type GetAllCategoriesResType = z.infer<typeof getAllCategoriesResSchema>;
export type GetAllCategoriesQueryType = z.infer<typeof getAllCategoriesQuerySchema>;
export type GetCategoryDetailResType = z.infer<typeof getCategoryDetailResSchema>;
export type CreateCategoryBodyType = z.infer<typeof createCategoryBodySchema>;
export type GetCategoryParamsType = z.infer<typeof getCategoryParamsSchema>;
export type UpdateCategoryBodyType = z.infer<typeof updateCategoryBodySchema>;
