import { z } from "zod";

export const categoryTranslationSchema = z.object({
  id: z.number({ error: "Error.InvalidCategoryTranslationId" }),
  categoryId: z.number({ error: "Error.InvalidCategoryId" }),
  languageId: z.string({ error: "Error.InvalidLanguageId" }),
  name: z
    .string({ error: "Error.InvalidCategoryTranslationName" })
    .max(500, { message: "Error.CategoryTranslationNameTooLong" }),
  description: z.string({ error: "Error.InvalidCategoryTranslationDescription" }),
  createdById: z.number({ error: "Error.InvalidCreatedByID" }).nullable(),
  updatedById: z.number({ error: "Error.InvalidUpdatedByID" }).nullable(),
  deletedById: z.number({ error: "Error.InvalidDeletedByID" }).nullable(),
  deletedAt: z.date({ error: "Error.InvalidDeletedAt" }).nullable(),
  createdAt: z.date({ error: "Error.InvalidCreatedAt" }),
  updatedAt: z.date({ error: "Error.InvalidUpdatedAt" }),
});
