import { z } from "zod";

export const SKUSchema = z.object({
  id: z.number({ error: "Error.InvalidSKUId" }),
  value: z.string({ error: "Error.InvalidSKUValue" }).trim(),
  price: z.number({ error: "Error.InvalidSKUPrice" }).min(0, { error: "Error.SKUPriceTooLow" }),
  stock: z.number({ error: "Error.InvalidSKUStock" }).min(0, { error: "Error.SKUStockTooLow" }),
  image: z.string({ error: "Error.InvalidSKUImage" }),
  productId: z.number({ error: "Error.InvalidProductId" }),
  createdById: z.number({ error: "Error.InvalidCreatedById" }).nullable(),
  updatedById: z.number({ error: "Error.InvalidUpdatedById" }).nullable(),
  deletedById: z.number({ error: "Error.InvalidDeletedById" }).nullable(),
  deletedAt: z.date({ error: "Error.InvalidDeletedAt" }).nullable(),
  createdAt: z.date({ error: "Error.InvalidCreatedAt" }),
  updatedAt: z.date({ error: "Error.InvalidUpdatedAt" }),
});

export type SKUSchemaType = z.infer<typeof SKUSchema>;
