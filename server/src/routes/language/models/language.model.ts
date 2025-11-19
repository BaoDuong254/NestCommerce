import { z } from "zod";

export const languageSchema = z.object({
  id: z.string({ error: "Error.InvalidLanguageID" }).max(10, { error: "Error.LanguageIDTooLong" }),
  name: z.string({ error: "Error.InvalidLanguageName" }).max(500, { error: "Error.LanguageNameTooLong" }),
  createdById: z.number({ error: "Error.InvalidCreatedByID" }).nullable(),
  updatedById: z.number({ error: "Error.InvalidUpdatedByID" }).nullable(),
  deletedAt: z.date({ error: "Error.InvalidDeletedAt" }).nullable(),
  createdAt: z.date({ error: "Error.InvalidCreatedAt" }),
  updatedAt: z.date({ error: "Error.InvalidUpdatedAt" }),
});

export const getLanguagesResSchema = z.object({
  data: z.array(languageSchema, { error: "Error.InvalidLanguagesData" }),
  totalItems: z.number({ error: "Error.InvalidTotalItems" }),
});

export const getLanguageParamsSchema = z
  .object({
    languageId: z.string({ error: "Error.InvalidLanguageID" }).max(10, { error: "Error.LanguageIDTooLong" }),
  })
  .strict();

export const getLanguageDetailResSchema = languageSchema;

export const createLanguageBodySchema = languageSchema
  .pick({
    id: true,
    name: true,
  })
  .strict();

export const updateLanguageBodySchema = languageSchema
  .pick({
    name: true,
  })
  .strict();

export type LanguageType = z.infer<typeof languageSchema>;
export type GetLanguagesResType = z.infer<typeof getLanguagesResSchema>;
export type GetLanguageDetailResType = z.infer<typeof getLanguageDetailResSchema>;
export type CreateLanguageBodyType = z.infer<typeof createLanguageBodySchema>;
export type GetLanguageParamsType = z.infer<typeof getLanguageParamsSchema>;
export type UpdateLanguageBodyType = z.infer<typeof updateLanguageBodySchema>;
