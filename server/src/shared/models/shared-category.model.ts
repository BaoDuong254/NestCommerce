import { categoryTranslationSchema } from "src/shared/models/shared-category-translation.model";
import { z } from "zod";

export const categorySchema = z.object({
  id: z.number({ error: "Error.InvalidCategoryId" }),
  parentCategoryId: z.number({ error: "Error.InvalidParentCategoryId" }).nullable(),
  name: z.string({ error: "Error.InvalidCategoryName" }),
  logo: z.string({ error: "Error.InvalidCategoryLogo" }).nullable(),
  createdById: z.number({ error: "Error.InvalidCreatedByID" }).nullable(),
  updatedById: z.number({ error: "Error.InvalidUpdatedByID" }).nullable(),
  deletedById: z.number({ error: "Error.InvalidDeletedByID" }).nullable(),
  deletedAt: z.date({ error: "Error.InvalidDeletedAt" }).nullable(),
  createdAt: z.date({ error: "Error.InvalidCreatedAt" }),
  updatedAt: z.date({ error: "Error.InvalidUpdatedAt" }),
});

export const categoryIncludeTranslationSchema = categorySchema.extend({
  categoryTranslations: z.array(categoryTranslationSchema),
});
