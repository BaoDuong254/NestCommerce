import { z } from "zod";

export const ProductTranslationSchema = z.object({
  id: z.number({ error: "Error.InvalidProductTranslationId" }),
  productId: z.number({ error: "Error.InvalidProductId" }),
  name: z
    .string({ error: "Error.InvalidProductTranslationName" })
    .max(500, { error: "Error.ProductTranslationNameTooLong" }),
  description: z.string({ error: "Error.InvalidProductTranslationDescription" }),
  languageId: z.string({ error: "Error.InvalidLanguageId" }),
  createdById: z.number({ error: "Error.InvalidCreatedById" }).nullable(),
  updatedById: z.number({ error: "Error.InvalidUpdatedById" }).nullable(),
  deletedById: z.number({ error: "Error.InvalidDeletedById" }).nullable(),
  deletedAt: z.iso.datetime({ error: "Error.InvalidDeletedAt" }).nullable(),
  createdAt: z.iso.datetime({ error: "Error.InvalidCreatedAt" }),
  updatedAt: z.iso.datetime({ error: "Error.InvalidUpdatedAt" }),
});

export type ProductTranslationType = z.infer<typeof ProductTranslationSchema>;
