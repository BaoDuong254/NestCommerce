import { z } from "zod";

export const VariantSchema = z.object({
  value: z.string({ error: "Error.InvalidVariantValue" }).trim(),
  options: z.array(z.string({ error: "Error.InvalidVariantOption" }).trim()),
});

export const VariantsSchema = z.array(VariantSchema).superRefine((variants, ctx) => {
  // Check for duplicate variant values and options
  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i];
    const isExistingVariant = variants.findIndex((v) => v.value.toLowerCase() === variant.value.toLowerCase()) !== i;
    if (isExistingVariant) {
      return ctx.addIssue({
        code: "custom",
        message: `Variant value ${variant.value} already exists. Please check again.`,
        path: ["variants"],
      });
    }
    const isDifferentOption = variant.options.some((option, index) => {
      const isExistingOption = variant.options.findIndex((o) => o.toLowerCase() === option.toLowerCase()) !== index;
      return isExistingOption;
    });
    if (isDifferentOption) {
      return ctx.addIssue({
        code: "custom",
        message: `Variant ${variant.value} contains duplicate option names. Please check again.`,
        path: ["variants"],
      });
    }
  }
});

export const ProductSchema = z.object({
  id: z.number({ error: "Error.InvalidProductId" }),
  publishedAt: z.date({ error: "Error.InvalidPublishedAt" }).nullable(),
  name: z.string({ error: "Error.InvalidProductName" }).trim().max(500, { error: "Error.ProductNameTooLong" }),
  basePrice: z.number({ error: "Error.InvalidBasePrice" }).min(0, { error: "Error.BasePriceTooLow" }),
  virtualPrice: z.number({ error: "Error.InvalidVirtualPrice" }).min(0, { error: "Error.VirtualPriceTooLow" }),
  brandId: z.number({ error: "Error.InvalidBrandId" }).positive({ error: "Error.InvalidBrandId" }),
  images: z.array(z.string({ error: "Error.InvalidProductImage" })),
  variants: VariantsSchema, // Json field represented as a record
  createdById: z.number({ error: "Error.InvalidCreatedById" }).nullable(),
  updatedById: z.number({ error: "Error.InvalidUpdatedById" }).nullable(),
  deletedById: z.number({ error: "Error.InvalidDeletedById" }).nullable(),
  deletedAt: z.date({ error: "Error.InvalidDeletedAt" }).nullable(),
  createdAt: z.date({ error: "Error.InvalidCreatedAt" }),
  updatedAt: z.date({ error: "Error.InvalidUpdatedAt" }),
});

export type ProductType = z.infer<typeof ProductSchema>;
export type VariantsType = z.infer<typeof VariantsSchema>;
