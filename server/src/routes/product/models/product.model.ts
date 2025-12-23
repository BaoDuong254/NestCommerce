import { UpsertSKUBodySchema } from "src/routes/product/models/sku.model";
import { OrderBy, SortBy } from "src/shared/constants/other.constant";
import { brandIncludeTranslationSchema } from "src/shared/models/shared-brand.model";
import { categoryIncludeTranslationSchema } from "src/shared/models/shared-category.model";
import { ProductTranslationSchema } from "src/shared/models/shared-product-translation.model";
import { ProductSchema, VariantsType } from "src/shared/models/shared-product.model";
import { SKUSchema } from "src/shared/models/shared-sku.model";
import { z } from "zod";

function generateSKUs(variants: VariantsType) {
  // Function to generate all combinations of variant options
  function getCombinations(arrays: string[][]): string[] {
    return arrays.reduce((acc, curr) => acc.flatMap((x) => curr.map((y) => `${x}${x ? "-" : ""}${y}`)), [""]);
  }

  // Get array of options from variants
  const options = variants.map((variant) => variant.options);

  // Create all combinations
  const combinations = getCombinations(options);

  // Convert combinations to SKU objects
  return combinations.map((value) => ({
    value,
    price: 0,
    stock: 100,
    image: "",
  }));
}

// For public products
export const GetProductsQuerySchema = z.object({
  page: z.coerce
    .number({ error: "Error.InvalidPage" })
    .int({ error: "Error.PageMustBeInteger" })
    .positive({ error: "Error.PageMustBePositive" })
    .default(1),
  limit: z.coerce
    .number({ error: "Error.InvalidLimit" })
    .int({ error: "Error.LimitMustBeInteger" })
    .positive({ error: "Error.LimitMustBePositive" })
    .default(10),
  name: z.string({ error: "Error.InvalidProductName" }).optional(),
  brandIds: z
    .preprocess(
      (value) => {
        if (typeof value === "string") {
          return [Number(value)];
        }
        return value;
      },
      z.array(
        z.coerce
          .number({ error: "Error.InvalidBrandId" })
          .int({ error: "Error.BrandIdMustBeInteger" })
          .positive({ error: "Error.BrandIdMustBePositive" })
      )
    )
    .optional(),
  categories: z
    .preprocess(
      (value) => {
        if (typeof value === "string") {
          return [Number(value)];
        }
        return value;
      },
      z.array(
        z.coerce
          .number({ error: "Error.InvalidCategoryId" })
          .int({ error: "Error.CategoryIdMustBeInteger" })
          .positive({ error: "Error.CategoryIdMustBePositive" })
      )
    )
    .optional(),
  minPrice: z.coerce
    .number({ error: "Error.InvalidMinPrice" })
    .positive({ error: "Error.MinPriceMustBePositive" })
    .optional(),
  maxPrice: z.coerce
    .number({ error: "Error.InvalidMaxPrice" })
    .positive({ error: "Error.MaxPriceMustBePositive" })
    .optional(),
  createdById: z.coerce
    .number({ error: "Error.InvalidCreatedById" })
    .int({ error: "Error.CreatedByIdMustBeInteger" })
    .positive({ error: "Error.CreatedByIdMustBePositive" })
    .optional(),
  orderBy: z.enum([OrderBy.Asc, OrderBy.Desc], { error: "Error.InvalidOrderBy" }).default(OrderBy.Desc),
  sortBy: z
    .enum([SortBy.CreatedAt, SortBy.Price, SortBy.Sale], { error: "Error.InvalidSortBy" })
    .default(SortBy.CreatedAt),
});

// For manage products (admin/shop owner)
export const GetManageProductsQuerySchema = GetProductsQuerySchema.extend({
  isPublic: z.preprocess((value) => value === "true", z.boolean({ error: "Error.InvalidIsPublic" })).optional(),
  createdById: z.coerce
    .number({ error: "Error.InvalidCreatedById" })
    .int({ error: "Error.CreatedByIdMustBeInteger" })
    .positive({ error: "Error.CreatedByIdMustBePositive" }),
});

export const GetProductsResSchema = z.object({
  data: z.array(
    ProductSchema.extend({
      productTranslations: z.array(ProductTranslationSchema),
    })
  ),
  totalItems: z.number({ error: "Error.InvalidTotalItems" }),
  page: z.number({ error: "Error.InvalidPage" }),
  limit: z.number({ error: "Error.InvalidLimit" }),
  totalPages: z.number({ error: "Error.InvalidTotalPages" }),
});

export const GetProductParamsSchema = z
  .object({
    productId: z.coerce
      .number({ error: "Error.InvalidProductId" })
      .int({ error: "Error.ProductIdMustBeInteger" })
      .positive({ error: "Error.ProductIdMustBePositive" }),
  })
  .strict();

export const GetProductDetailResSchema = ProductSchema.extend({
  productTranslations: z.array(ProductTranslationSchema),
  skus: z.array(SKUSchema),
  categories: z.array(categoryIncludeTranslationSchema),
  brand: brandIncludeTranslationSchema,
});

export const CreateProductBodySchema = ProductSchema.pick({
  name: true,
  basePrice: true,
  virtualPrice: true,
  brandId: true,
  images: true,
  variants: true,
})
  .extend({
    publishedAt: z.iso.datetime({ error: "Error.InvalidPublishedAt" }).nullable(),
    categories: z.array(
      z.coerce
        .number({ error: "Error.InvalidCategoryId" })
        .int({ error: "Error.CategoryIdMustBeInteger" })
        .positive({ error: "Error.CategoryIdMustBePositive" })
    ),
    skus: z.array(UpsertSKUBodySchema),
  })
  .strict()
  .superRefine(({ variants, skus }, ctx) => {
    // Check SKU count is valid
    const skuValueArray = generateSKUs(variants);
    if (skus.length !== skuValueArray.length) {
      return ctx.addIssue({
        code: "custom",
        path: ["skus"],
        message: `SKU count should be ${skuValueArray.length}. Please check again.`,
      });
    }

    // Check SKU values are valid
    let wrongSKUIndex = -1;
    const isValidSKUs = skus.every((sku, index) => {
      const isValid = sku.value === skuValueArray[index].value;
      if (!isValid) {
        wrongSKUIndex = index;
      }
      return isValid;
    });
    if (!isValidSKUs) {
      ctx.addIssue({
        code: "custom",
        path: ["skus"],
        message: `SKU value at index ${wrongSKUIndex} is invalid. Please check again.`,
      });
    }
  });

export const UpdateProductBodySchema = CreateProductBodySchema;

export type GetProductsResType = z.infer<typeof GetProductsResSchema>;
export type GetProductsQueryType = z.infer<typeof GetProductsQuerySchema>;
export type GetManageProductsQueryType = z.infer<typeof GetManageProductsQuerySchema>;
export type GetProductDetailResType = z.infer<typeof GetProductDetailResSchema>;
export type CreateProductBodyType = z.infer<typeof CreateProductBodySchema>;
export type GetProductParamsType = z.infer<typeof GetProductParamsSchema>;
export type UpdateProductBodyType = z.infer<typeof UpdateProductBodySchema>;
