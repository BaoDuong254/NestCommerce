import { z } from "zod";

export const brandTranslationSchema = z.object({
  id: z.number({ error: "Error.InvalidID" }).positive({ error: "Error.InvalidID" }),
  brandId: z.number({ error: "Error.InvalidBrandID" }).positive({ error: "Error.InvalidBrandID" }),
  languageId: z.string({ error: "Error.InvalidLanguageID" }),
  name: z.string({ error: "Error.InvalidName" }).max(500, { error: "Error.NameTooLong" }),
  description: z.string({ error: "Error.InvalidDescription" }),
  createdById: z.number({ error: "Error.InvalidCreatedByID" }).nullable(),
  updatedById: z.number({ error: "Error.InvalidUpdatedByID" }).nullable(),
  deletedById: z.number({ error: "Error.InvalidDeletedByID" }).nullable(),
  deletedAt: z.iso.datetime({ error: "Error.InvalidDeletedAt" }).nullable(),
  createdAt: z.iso.datetime({ error: "Error.InvalidCreatedAt" }),
  updatedAt: z.iso.datetime({ error: "Error.InvalidUpdatedAt" }),
});
