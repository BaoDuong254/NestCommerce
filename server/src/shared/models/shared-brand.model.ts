import { brandTranslationSchema } from "src/shared/models/shared-brand-translation.model";
import { z } from "zod";

export const brandSchema = z.object({
  id: z.number({ error: "Error.InvalidID" }).positive({ error: "Error.InvalidID" }),
  name: z.string({ error: "Error.InvalidName" }).max(500, { error: "Error.NameTooLong" }),
  logo: z.url({ error: "Error.InvalidLogoURL" }).max(1000, { error: "Error.LogoURLTooLong" }),
  createdById: z.number({ error: "Error.InvalidCreatedByID" }).nullable(),
  updatedById: z.number({ error: "Error.InvalidUpdatedByID" }).nullable(),
  deletedById: z.number({ error: "Error.InvalidDeletedByID" }).nullable(),
  deletedAt: z.iso.datetime({ error: "Error.InvalidDeletedAt" }).nullable(),
  createdAt: z.iso.datetime({ error: "Error.InvalidCreatedAt" }),
  updatedAt: z.iso.datetime({ error: "Error.InvalidUpdatedAt" }),
});

export const brandIncludeTranslationSchema = brandSchema.extend({
  brandTranslations: z.array(brandTranslationSchema),
});
